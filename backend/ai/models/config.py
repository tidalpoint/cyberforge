from typing import Final, Literal

Provider = Literal["openai", "cohere"]

DEFAULT_PROVIDER: Final[Provider] = "openai"

DEFAULT_MODELS: Final[dict[Provider, str]] = {
    "openai": "gpt-4o-mini",
    "cohere": "command-a-03-2025",
}

DEFAULT_EMBEDDING_MODELS: Final[dict[Provider, str]] = {
    "openai": "text-embedding-ada-002",
    "cohere": "embed-english-v2.0",
}

PROMPT_VERSION = "v2"
