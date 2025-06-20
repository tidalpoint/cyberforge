from langchain.prompts import PromptTemplate

from ..utils import create_prompt_dict
from .gpt_4o import PROMPTS as BASE_PROMPTS

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

PROMPTS = create_prompt_dict(base=BASE_PROMPTS, score_control=SCORE_CONTROL)
