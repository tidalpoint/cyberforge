from typing import Any

from ai.models import cohere, openai
from ai.models.config import Provider

PROVIDER_REGISTRY: dict[Provider, Any] = {
    "openai": {
        "llm": openai.create_llm,
        "embedding": openai.get_embedding_function,
        "prompts": openai.get_prompts,
    },
    "cohere": {
        "llm": cohere.create_llm,
        "embedding": cohere.get_embedding_function,
        "prompts": cohere.get_prompts,
    },
}
