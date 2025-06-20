import hashlib
import json
import os
import re
import threading
from collections import defaultdict
from datetime import datetime
from math import ceil
from pathlib import Path
from typing import cast
from uuid import uuid4

import faiss
from langchain.retrievers import ContextualCompressionRetriever
from langchain.schema import Document
from langchain_cohere import CohereRerank
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.document_loaders import PyPDFDirectoryLoader, PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pydantic import BaseModel

import globals
from ai.models import create_llm, get_embedding_function, get_prompts
from ai.models.config import DEFAULT_MODELS, DEFAULT_PROVIDER, PROMPT_VERSION
from ai.utils import invoke_model
from utils import markdown_to_pdf

# --------------------------------------------------------------------------------
#: Misc utils
# --------------------------------------------------------------------------------


def clean_json_str(input_string: str) -> str:
    # Use regex to find the JSON-like part of the string
    match = re.search(r"(\{.*\}|\[.*\])", input_string, re.DOTALL)
    if match:
        stripped_string = match.group(0)  # Extract the matched portion
        return stripped_string
    return ""  # Return an empty JSON object if no match is found


def data_md5(data: str | bytes) -> str:
    """
    Compute the MD5 hash of the data.

    Args:
        data (Union[str, bytes]): The data to hash. Can be a string or bytes.

    Returns:
        str: The MD5 hash of the input data as a hexadecimal string.

    """

    if isinstance(data, str):
        # Convert string to bytes
        data = data.encode("utf-8")

    # Create an MD5 hash object
    md5_hash = hashlib.md5()

    # Update the hash object with the input data
    md5_hash.update(data)

    # Return the hexadecimal representation of the hash
    return md5_hash.hexdigest()


# --------------------------------------------------------------------------------
#: Vector store / Document embedding
# --------------------------------------------------------------------------------


def new_vector_store() -> None:
    """Creates a new vector store that gets persisted in the file system"""
    embedding_function = get_embedding_function()

    # Set the length of the embedding function's vectors
    index = faiss.IndexFlatL2(len(embedding_function.embed_query("hello world")))

    globals.vector_store = FAISS(
        index=index,
        embedding_function=embedding_function,
        docstore=InMemoryDocstore(),
        index_to_docstore_id={},
    )


def embed_docs() -> None:
    """
    Update and persist the current vector store by embedding new sections from documents
    that haven't been embedded yet.
    """

    if not globals.vector_store:
        raise ValueError("Vector store is not initialized")

    input_docs = [doc for doc in get_input_docs() if "embedded" not in doc.metadata]

    print(f"embed_docs: processing {len(input_docs)} docs")
    if not input_docs:
        return

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=globals.CHUNK_SIZE,
        chunk_overlap=globals.CHUNK_OVERLAP,
        add_start_index=True,
    )

    all_splits = []
    for doc in input_docs:
        doc.metadata["embedded"] = 1

        splits = text_splitter.split_documents([doc])
        all_splits.extend(splits)

    globals.vector_store.add_documents(documents=all_splits)
    globals.vector_store.save_local(globals.VECTOR_DB_FOLDER)


# --------------------------------------------------------------------------------
#: Document loading / retrieval / copying / deleting /replacing
# --------------------------------------------------------------------------------


def load_doc(file_path: str) -> None:
    """
    Load a document from file_path and add it to the global input docs store
    if it is not a duplicate. Returns nothing but modifies globals.input_docs.

    Notes:
    - Only PDF files are currently supported.
    - The file content is deduplicated using MD5 hash of text.
    - LangChain creates one Document per PDF page, but they are concatenated into one.
    """

    if not file_path.endswith(".pdf"):
        raise ValueError(f"Unsupported file type: {file_path}")

    basename = os.path.basename(file_path)
    loader = PyPDFLoader(file_path=file_path, mode="single", pages_delimiter="\n\n")
    document = loader.load()[0]

    document.page_content = re.sub(r"\s+", " ", document.page_content)

    doc_md5 = data_md5(document.page_content)

    # Check for duplicate based on content hash
    if any(doc_md5 == d.metadata.get("md5") for d in get_input_docs()):
        print(f"load_doc: {file_path} matches existing file, ignoring")
        return

    doc_id = str(uuid4())
    timestamp = datetime.now().astimezone().isoformat(timespec="milliseconds")

    document.metadata = {
        "id": doc_id,
        "md5": doc_md5,
        "name": basename,
        "source": basename,
        "createdAt": timestamp,
        "updatedAt": timestamp,
    }

    globals.input_docs[doc_id] = document


def load_docs(dir_path: str) -> None:
    """Calls load_doc() on each file in the directory -> sets globals.input_docs"""

    globals.input_docs = {}

    for root, _, files in os.walk(dir_path):
        for file in files:
            file_path = os.path.join(root, file)
            load_doc(file_path)


def get_input_docs() -> list:
    return globals.input_docs.values()


def delete_doc(id: str) -> None:
    """
    Delete the specified doc.

    Side effects:
        Removes doc from globals.input_docs
        Removed associated vectors from gloals.vector_store
    """

    if not globals.vector_store:
        raise ValueError("Vector store is not initialized")

    doc = globals.input_docs[id]  # Raises KeyError

    for section in doc.metadata["section_list"]:
        globals.vector_store.delete(ids=section["section_vector_id_list"])

    del globals.input_docs[id]


def replace_doc(id: str, file_path: str) -> None:
    """
    Replace an existing doc.
    Note: The id of the existing doc is no longer valid and has been replaced
          with the id of the new doc

    Args:
        id        - the id of the doc to delete
        file_path - the file to be added

    Returns: the id of the new doc

    Side effects: see delete_doc() and load_doc()
    """
    delete_doc(id)
    load_doc(file_path)


# --------------------------------------------------------------------------------
#: Document content retrieval
# --------------------------------------------------------------------------------


def whole_doc_text():
    doc_list = get_input_docs()

    content_list = [doc.page_content for doc in doc_list]

    document_text = "\n\n".join(content_list)
    return document_text


def rag_documents(query: str) -> list[Document]:
    if not globals.vector_store:
        raise ValueError("Vector store is not initialized")

    if os.getenv("COHERE_API_KEY"):
        compressor = CohereRerank(model="rerank-v3.5", top_n=8)
        retriever = globals.vector_store.as_retriever(search_kwargs={"k": 20})

        compression_retriever = ContextualCompressionRetriever(
            base_compressor=compressor,
            base_retriever=retriever,
        )

        return compression_retriever.invoke(query)

    searches = globals.vector_store.similarity_search_with_score(query, k=8, fetch_k=20)
    documents = [search[0] for search in searches]
    return documents


def rag_sections(query: str) -> str:
    sections = [doc.page_content for doc in rag_documents(query)]

    return "\n\n".join(sections)


# --------------------------------------------------------------------------------
#: Expert knowledge retrieval
# --------------------------------------------------------------------------------
def create_expert_knowledge_vector_store() -> None:
    """Creates a new expert knowledge vector store that gets persisted in the file system"""
    try:
        loader = PyPDFDirectoryLoader(globals.EXPERT_KNOWLEDGE_FOLDER)
        documents = loader.load()

        if not documents:
            print("No documents found in expert knowledge folder")
            raise ValueError("No documents found in expert knowledge folder")

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=globals.CHUNK_SIZE,
            chunk_overlap=globals.CHUNK_OVERLAP,
        )
        splits = text_splitter.split_documents(documents)

        globals.expert_knowledge_vector_store = FAISS.from_documents(
            documents=splits, embedding=get_embedding_function()
        )
        globals.expert_knowledge_vector_store.save_local(
            globals.EXPERT_KNOWLEDGE_VECTOR_DB_FOLDER
        )
    except Exception as e:
        print(f"Failed to create expert knowledge vector store: {e}")
        raise ValueError("Failed to create expert knowledge vector store") from e


def expert_knowledge(query: str) -> str:
    if not globals.expert_knowledge_vector_store:
        print("Expert knowledge vector store is not initialized")
        raise ValueError("Expert knowledge vector store is not initialized")

    compressor = CohereRerank(model="rerank-v3.5", top_n=8)
    retriever = globals.expert_knowledge_vector_store.as_retriever(
        search_kwargs={"k": 20}
    )

    compression_retriever = ContextualCompressionRetriever(
        base_compressor=compressor,
        base_retriever=retriever,
    )

    documents = compression_retriever.invoke(query)
    sections = [doc.page_content for doc in documents]

    return "\n\n".join(sections)


# --------------------------------------------------------------------------------
# Cyber security framework controls
# --------------------------------------------------------------------------------


def evaluate_compliance(framework_id: str):
    if framework_id not in globals.SUPPORTED_FRAMEWORKS:
        raise ValueError(f"Unsupported framework {framework_id}")

    globals.current_csf = framework_id

    with open(f"{globals.CONTROLS_DIR}/{globals.current_csf}_controls.json") as f:
        globals.csf_controls = json.load(f)

    csf_control_list_compliance()

    industry = get_industry_type()
    top_5_threats_info(industry, framework_id)


def get_csf_compliance() -> dict:
    return globals.csf_compliance


def csf_compliance_model_invoke(control):
    try:
        print(f"Evaluating control {control['id']}")

        document_text = rag_sections(control["description"])

        prompts = get_prompts()

        score_prompt = prompts["score_control"].format(
            document_text=document_text,
            csf=globals.current_csf,
            control_value=control["description"],
        )

        score = invoke_model(prompt=score_prompt, prompt_key="score_control") or {
            "score": 0,
            "reason": "Was unable to evaluate this control",
        }

        actions_prompt = prompts["control_actions"].format(
            document_text=document_text,
            csf_name=globals.current_csf,
            control_value=control["description"],
        )

        actions = (
            invoke_model(prompt=actions_prompt, prompt_key="control_actions") or []
        )

        globals.num_controls_evaluated += 1
        globals.csf_compliance[control["id"]] = {
            **control,
            "score": score["score"],
            "reason": score["reason"],
            "actions": actions,
        }

        print(
            f"Evaluated control {control['id']} with score {score['score']}"
        )
        print(f"Controls evaluated: {globals.num_controls_evaluated}")
    except Exception as e:
        print(f"Failed evaluation for control {control['id']}: {e}")
        globals.csf_compliance[control["id"]] = {
            **control,
            "score": 0,
            "reason": "Was unable to evaluate this control",
            "actions": [],
        }


def csf_control_list_compliance() -> None:
    """
    Based on the current document set, evaluate compliance for each input control name (id)
    wrt to the specified cyber security framework (CSF) controls.

    Args:
        control_id_list (str) the set of control names (ids) to evaluate
        csf_name (str) the name of the CSF.  Must be one of the strings in globals.SUPPORTED_FRAMEWORKS

    Side effect:
        sets globals.csf_compliance
    """

    print("Starting CSF compliance evaluation\n")

    globals.num_controls_evaluated = 0
    globals.csf_compliance = {}

    threads = []

    for control in globals.csf_controls.values():
        t = threading.Thread(
            target=csf_compliance_model_invoke, args=(control,)
        )
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print("Finished CSF compliance evaluation\n")


def get_control_compliance_by_id(id: str) -> dict:
    return globals.csf_compliance[id]


def get_compliance_score_stats() -> dict:
    ret = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0}

    for compliance_info in globals.csf_compliance.values():
        score = compliance_info["score"]

        ret[score] += 1

    return ret


# --------------------------------------------------------------------------------
#: Update docs to improve CSF compliance scores
# --------------------------------------------------------------------------------


def invoke_doc_improvement(document: Document, missing_controls: list[str]) -> None:
    """
    Improve document content based on control gaps -> create PDF -> save it to the specified output path.
    """
    model = create_llm(temperature=0.0)
    prompt = get_prompts()["improve_document"].format(
        document_text=document.page_content,
        missing_controls="\n".join(missing_controls),
        csf=globals.current_csf,
    )

    improved_document_text = model.invoke(prompt).content

    if not improved_document_text or not isinstance(improved_document_text, str):
        return

    output_path = os.path.join(globals.IMPROVED_DOCS_DIR, document.metadata["name"])

    markdown_to_pdf(improved_document_text, output_path)

    globals.improved_docs.append(
        {
            "id": document.metadata["id"],
            "name": document.metadata["name"],
            "original_content": document.page_content,
            "improved_content": improved_document_text,
            "controls_improved": missing_controls,
        }
    )


def improve_documents():
    globals.improved_docs = []
    LOW_SCORE_THRESHOLD = 3

    document_to_controls_map: dict[str, list[str]] = defaultdict(list)
    threads: list[threading.Thread] = []

    # Filter controls with scores below the threshold
    low_score_controls = [
        control
        for control in globals.csf_compliance.values()
        if control["score"] < LOW_SCORE_THRESHOLD
    ]

    # Map document ids to their corresponding low-scoring controls
    for control in low_score_controls:
        sections = rag_documents(control["description"])

        for section in sections:
            doc_id = section.metadata["id"]
            document_to_controls_map[doc_id].append(control["description"])

    # Improve each document
    for doc_id, control_list in document_to_controls_map.items():
        doc = globals.input_docs[doc_id]

        t = threading.Thread(target=invoke_doc_improvement, args=(doc, control_list))
        threads.append(t)
        t.start()

    for t in threads:
        t.join()


# --------------------------------------------------------------------------------
#: Cyber security framework recommendations
# --------------------------------------------------------------------------------


def get_csf_recommendations() -> list[str]:
    """Recommends cyber security frameworks based on the input documents."""

    class PromptOutput(BaseModel):
        recommended_frameworks: list[str]

    model = create_llm().with_structured_output(PromptOutput)
    prompt = get_prompts()["framework_recommendation"].format(
        document_text=whole_doc_text(),
        framework_options=globals.SUPPORTED_FRAMEWORKS,
    )

    result = cast(PromptOutput, model.invoke(prompt))

    return result.recommended_frameworks


# ----------------------------------------------------------------------
#: Industry type
# ----------------------------------------------------------------------


def get_industry_type() -> str:
    """Determines the company's industry type based on the input documents."""

    class PromptOutput(BaseModel):
        industry: str

    model = create_llm(temperature=0.0).with_structured_output(PromptOutput)
    prompt = get_prompts()["determine_industry"].format(
        document_text=whole_doc_text(), industry_options=globals.SUPPORTED_INDUSTRIES
    )

    result = cast(PromptOutput, model.invoke(prompt))

    return result.industry


# ----------------------------------------------------------------------
#: Threats
# ----------------------------------------------------------------------


def top_5_threats_info(industry_type: str, csf_name: str) -> list[dict]:
    globals.top_5_threats = []

    if industry_type not in globals.SUPPORTED_INDUSTRIES:
        raise ValueError(f"Unsupported industry type: {industry_type}")

    if csf_name not in globals.SUPPORTED_FRAMEWORKS:
        raise ValueError(f"Unsupported framework: {csf_name}")

    if not os.path.exists(globals.THREATS_FILE_PATH) or not globals.csf_compliance:
        return []

    with open(globals.THREATS_FILE_PATH, encoding="utf-8") as f:
        all_threats = json.load(f)

    # Filter threats based on the industry type
    relevant_threat_ids = globals.INDUSTRY_TO_THREATS[industry_type]
    relevant_threats = [threat for threat in all_threats if threat["id"] in relevant_threat_ids]

    for threat in relevant_threats:
        control_ids = threat["control_mappings"][globals.current_csf]
        controls = [globals.csf_compliance[cid] for cid in control_ids]
        avg_score = sum(control["score"] for control in controls) / len(controls)

        globals.top_5_threats.append(
            {
                "id": str(uuid4()),
                "name": threat["name"],
                "short_desc": threat["short_desc"],
                "long_desc": threat["long_desc"],
                "reason": threat["reason"],
                "score": avg_score,
                "controls": controls,
            }
        )

    return globals.top_5_threats


def get_top_5_threats():
    return globals.top_5_threats


def top_threat_info_by_id(threat_id: str) -> dict:
    """
    Return threat info from top 5 threats using the specified ID.
    """
    for threat in globals.top_5_threats:
        if threat["id"] == threat_id:
            return threat

    raise KeyError(f"Threat ID not found: {threat_id}")


# --------------------------------------------------------------------------------
#: Evaluate PIPEDA
# --------------------------------------------------------------------------------


def answer_pipeda_batch(document_text: str, questions: list[str], result_list: list):
    prompt = get_prompts()["evaluate_pipeda"].format(
        document_text=document_text, questionnaire=questions
    )
    model_answer = create_llm(temperature=0.0).invoke(prompt)

    # Parse model response
    try:
        question_list = json.loads(clean_json_str(model_answer.content))
    except Exception as e:
        print(f"Failed to parse PIPEDA batch: {e}")
        return None

    for question in question_list:
        question.update(
            {"id": str(uuid4()), "agentAnswer": question["answer"], "answerer": "agent"}
        )

    result_list.extend(question_list)


def answer_pipeda() -> None:
    """
    Answers the PIPEDA Questionnaire based on input documents.

    Side effect:
        - Sets `globals.questionnaire_result`
        - Saves the result to the current org profile directory
    """

    QUESTIONNAIRE_FILE_PATH = Path("questionnaires/PIPEDA_Questionnaire.txt")

    with QUESTIONNAIRE_FILE_PATH.open("r", encoding="utf-8") as file:
        questions = [line.strip() for line in file if line.strip()]

    document_text = "\n\n".join(
        f"DocumentSource: {doc.metadata['source']} DocumentContent: {doc.page_content}"
        for doc in get_input_docs()
    )

    threads = []

    # Split questionnaire into batches to avoid exceeding token limits
    result_list = []
    batch_size = 10
    total_batches = ceil(len(questions) / batch_size)

    for i in range(total_batches):
        start = i * batch_size
        end = start + batch_size
        question_batch = questions[start:end]

        t = threading.Thread(
            target=answer_pipeda_batch,
            args=(document_text, question_batch, result_list),
        )
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    questionnaire = {
        "id": str(uuid4()),
        "name": "PIPEDA Questionnaire",
        "questions": result_list,
        "createdAt": datetime.now().astimezone().isoformat(timespec="milliseconds"),
    }

    globals.questionnaire_result = questionnaire

    print("Finished processing questionnaire\n")
