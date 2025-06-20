from langchain.prompts import PromptTemplate

from ..utils import create_prompt_dict

FRAMEWORK_RECOMMENDATION = PromptTemplate(
    input_variables=["document_text", "framework_options"],
    template=(
        """
        You are tasked with recommending the best cybersecurity framework for an organization based on the analysis of multiple documents.
        Here is the combined document text:
        {document_text}

        Considering the following criteria:
        1. Organization's industry type
        2. Organization's number of employees
        3. Organization's geographic location
        4. Organization's critical assets
        5. Organization's tolerance for risk

        Recommend one or more cybersecurity frameworks from this list:
        {framework_options}

        Your output should be a list of strings that exactly match the options provided.
        Do not include any extra text or formatting in your output.
    """
    ),
)


SCORE_CONTROL = PromptTemplate(
    input_variables=["document_text", "csf", "control_value"],
    template=(
        """
    You are tasked with critically evaluating an organization's compliance with the {csf} cybersecurity framework, based only on the provided document text.

    Provided:
    - Control value: a specific compliance requirement from the framework.

    Instructions:
    - Only assign a score if there is clear, direct, and explicit evidence in the document supporting the control value.
    - Weak, indirect, partial, or implied evidence must be treated as insufficient.
    - If the evidence is not strong and specific, assign a low score.
    - Never assume or infer compliance beyond what is explicitly stated.

    Scoring:
    - Assign a single integer score between 0 and 5:
      - 0 = No evidence at all.
      - 1 = Minimal or vague evidence; not reliable.
      - 2 = Some partial evidence; major gaps remain.
      - 3 = Moderate evidence; some gaps or lack of specificity.
      - 4 = Strong evidence with minor omissions.
      - 5 = Complete, explicit, and comprehensive evidence.

    Additional rules:
    - When in doubt, lower the score.
    - Be highly critical. Favor underestimating rather than overestimating compliance.
    - Quote or clearly reference the exact part of the document text that supports your score.

    Output format:
    Return a valid JSON string with two fields:
    - "score": the assigned integer score.
    - "reason": a one-sentence justification directly citing specific document content.

    Document text: {document_text}
    Control value: {control_value}
    """
    ),
)


IMPROVE_DOCUMENT = PromptTemplate(
    input_variables=["document_text", "missing_controls", "csf"],
    template=(
        """
            You are a cybersecurity policy expert. Your task is to rewrite an internal policy document to better align it with specific missing {csf} controls.

            Below is the original document text:
            -----
            {document_text}
            -----

            The document currently lacks sufficient coverage or clarity in the following {csf} controls:
            {missing_controls}

            Rewrite the document to improve compliance with these controls. You should:

            - Add clear, actionable language where the original is vague or missing content.
            - Integrate necessary policies, procedures, or safeguards that reflect the intent of the listed controls.
            - Maintain professional tone and structure.
            - Do NOT reference the control numbers directly in the text; instead, integrate their requirements naturally into the policy language.
            - Do NOT include any introductory or explanatory text of what you are outputting; focus solely on the policy content.

            Output the revised document below:
            -----
    """
    ),
)


DETERMINE_INDUSTRY = PromptTemplate(
    input_variables=["document_text", "industry_options"],
    template=(
        """
        You are tasked with determining a business' industry type based on the analysis of multiple documents.
        Here is the combined documents text:
        {document_text}

        Select the most likely industry type from the following:
        {industry_options}

        Your output should be a single string that matches one of the options exactly.
        Do not include any extra text or formatting in your output.
    """
    ),
)


CONTROL_ACTIONS = PromptTemplate(
    input_variables=["document_text", "control_value", "csf_name"],
    template=(
        """
        The provided document text describes a company's security policies and proceedures.
        The provided control value is a {csf_name} cyber security framework control.
        It describes a requirement that needs to be met for the company to be compliant with the security framework.
        Using your knowledge of the {csf_name} cyber security framework and the provided Document text list 5
        actions the company could take to inprove compliance with the specified framework control.

        Do not include any reasoning in your output.

        Your output should be in JSON and should be a list of your suggested actions
        Document text: {document_text}
        Cyber security framework: {csf_name}
        Framework control: {control_value}
    """
    ),
)


EVALUATE_PIPEDA = PromptTemplate(
    input_variables=["document_text", "questionnaire"],
    template=(
        """
        You are an expert cybersecurity analyst evaluating policies for compliance with the PIPEDA (Personal Information Protection and Electronic Documents Act).

        ## Your Task

        Using the provided documents, answer each question in the questionnaire. Only respond based on the evidence in the document text.

        ## Input Format

        1. **Document Text** — Contains one or more policy sections, each beginning with:
        - `"DocumentSource"`: The name of the document.
        - `"DocumentContent"`: The contents of that document.

        2. **Questionnaire** — A list of questions (strings) related to PIPEDA compliance. Each question should be answered individually.

        ## Output Format

        Respond with a **strictly valid JSON array**. Each item in the array must contain:
        - `"question"`: (str) The question being answered.
        - `"answer"`: (str) A concise answer based on the document content, or `"No relevant information found"` if none is available.
        - `"sources"`: (list[str]) The list of `"DocumentSource"` values you used to support your answer.

        ## Guidelines

        - Read all `DocumentContent` values carefully.
        - Only use content from the documents to justify your answers.
        - If a question cannot be answered with confidence from the content, return `"No relevant information found"`.
        - Be concise, accurate, and faithful to the evidence.
        - Ensure the entire output is valid JSON — do not include comments, explanations, or extra formatting outside the array.

        ### Example output:
        ```json
        [
        {{
            "question": "Does the policy define a process for data breach notifications?",
            "answer": "Yes, the incident response section describes mandatory reporting and documentation of data breaches.",
            "sources": ["Incident Response Policy"]
        }},
        {{
            "question": "Is there a designated privacy officer mentioned in the policy?",
            "answer": "No relevant information found",
            "sources": []
        }}
        ]
        ```

        Document text: {document_text}
        Questionnaire: {questionnaire}
        """
    ),
)


PROMPTS = create_prompt_dict(
    framework_recommendation=FRAMEWORK_RECOMMENDATION,
    score_control=SCORE_CONTROL,
    improve_document=IMPROVE_DOCUMENT,
    determine_industry=DETERMINE_INDUSTRY,
    control_actions=CONTROL_ACTIONS,
    evaluate_pipeda=EVALUATE_PIPEDA,
)
