from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from ai.prompts.openai.gpt_4o import PROMPTS as GPT_4O_PROMPTS
from ai.prompts.openai.gpt_4o_mini import PROMPTS as GPT_4O_MINI_PROMPTS
from ai.prompts.utils import BasePromptDict

load_dotenv("../.env")


def create_llm(model: str, **kwargs) -> ChatOpenAI:
    return ChatOpenAI(model=model, **kwargs)


def get_embedding_function(model: str, **kwargs) -> OpenAIEmbeddings:
    return OpenAIEmbeddings(model=model, **kwargs)


def get_prompts(model: str) -> BasePromptDict:
    prompt_map = {
        "gpt-4o": GPT_4O_PROMPTS,
        "gpt-4o-mini": GPT_4O_MINI_PROMPTS,
    }

    return prompt_map[model]
