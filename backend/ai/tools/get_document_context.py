from langchain_core.tools import tool

from core import rag_sections


@tool
def get_document_context(message: str) -> str:
    """
    Use this tool to answer any question related to the uploaded cybersecurity policy documents.
    This includes questions about organizational roles (e.g., 'Who is the CEO?'), responsibilities, procedures, compliance details, and any other content that may be found within those documents.
    """
    print("Using get_document_context tool")

    return rag_sections(message)
