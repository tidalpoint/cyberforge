from typing import TypedDict

from langchain.prompts import PromptTemplate


class BasePromptDict(TypedDict):
    score_control: PromptTemplate
    framework_recommendation: PromptTemplate
    determine_industry: PromptTemplate
    improve_document: PromptTemplate
    control_actions: PromptTemplate
    evaluate_pipeda: PromptTemplate


def create_prompt_dict(
    base: dict[str, PromptTemplate] | BasePromptDict | None = None,
    **overrides: PromptTemplate,
) -> BasePromptDict:
    base = base or {}
    prompts = {**base, **overrides}

    return BasePromptDict(**prompts)
