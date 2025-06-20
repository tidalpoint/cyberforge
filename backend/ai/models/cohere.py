from dotenv import load_dotenv
from langchain_cohere import ChatCohere, CohereEmbeddings

from ai.prompts.cohere.command_a import PROMPTS as COMMAND_A_PROMPTS
from ai.prompts.cohere.command_r import PROMPTS as COMMAND_R_PROMPTS
from ai.prompts.cohere.command_r_plus import PROMPTS as COMMAND_R_PLUS_PROMPTS
from ai.prompts.utils import BasePromptDict

load_dotenv("../.env")


def create_llm(model: str | None = None, **kwargs) -> ChatCohere:
    return ChatCohere(model=model, **kwargs)


def get_embedding_function(model: str, **kwargs) -> CohereEmbeddings:
    return CohereEmbeddings(model=model, **kwargs)


def get_prompts(model: str) -> BasePromptDict:
    prompt_map = {
        "command-r": COMMAND_R_PROMPTS,
        "command-r-plus": COMMAND_R_PLUS_PROMPTS,
        "command-a-03-2025": COMMAND_A_PROMPTS,
    }

    return prompt_map[model]
