from typing import Literal, overload

from langchain_cohere import ChatCohere, CohereEmbeddings
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

from ai.models.config import DEFAULT_EMBEDDING_MODELS, DEFAULT_MODELS, DEFAULT_PROVIDER
from ai.models.registry import PROVIDER_REGISTRY, Provider
from ai.prompts.utils import BasePromptDict

# If adding a new provider -> update overloads for full type hinting


@overload
def create_llm(
    provider: Literal["openai"], model: str | None = None, **kwargs
) -> ChatOpenAI: ...
@overload
def create_llm(
    provider: Literal["cohere"], model: str | None = None, **kwargs
) -> ChatCohere: ...
@overload
def create_llm(
    provider: None = None, model: str | None = None, **kwargs
) -> ChatOpenAI: ...


def create_llm(provider: Provider | None = None, model: str | None = None, **kwargs):
    provider = provider or DEFAULT_PROVIDER
    model = model or DEFAULT_MODELS[provider]

    print(f"Creating LLM with provider: {provider}, model: {model}")

    return PROVIDER_REGISTRY[provider]["llm"](model=model, **kwargs)


@overload
def get_embedding_function(
    provider: Literal["openai"], model: str | None = None, **kwargs
) -> OpenAIEmbeddings: ...
@overload
def get_embedding_function(
    provider: Literal["cohere"], model: str | None = None, **kwargs
) -> CohereEmbeddings: ...
@overload
def get_embedding_function(
    provider: None = None, model: str | None = None, **kwargs
) -> OpenAIEmbeddings: ...


def get_embedding_function(
    provider: Provider | None = None, model: str | None = None, **kwargs
):
    provider = provider or DEFAULT_PROVIDER
    model = model or DEFAULT_EMBEDDING_MODELS[provider]

    print(f"Getting embedding model with provider: {provider}, model: {model}")

    return PROVIDER_REGISTRY[provider]["embedding"](model=model, **kwargs)


def get_prompts(
    provider: Provider | None = None, model: str | None = None
) -> BasePromptDict:
    provider = provider or DEFAULT_PROVIDER
    model = model or DEFAULT_MODELS[provider]

    print(f"Getting prompt with provider: {provider}, model: {model}")

    return PROVIDER_REGISTRY[provider]["prompts"](model=model)
