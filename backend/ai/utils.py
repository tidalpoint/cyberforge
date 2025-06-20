import json
import re
from typing import Any

from ai.models import create_llm


def _extract_json(input_string: str) -> str:
    """Use regex to extract the JSON-like part of the string."""
    match = re.search(r"(\{.*\}|\[.*\])", input_string, re.DOTALL)
    return match.group(0) if match else ""


def _normalize_content(content: str | list[str | dict[Any, Any]]) -> str:
    """Convert mixed content to a string for JSON extraction."""
    if isinstance(content, str):
        return content
    elif isinstance(content, list):
        try:
            return "\n".join(
                json.dumps(item) if isinstance(item, dict) else str(item)
                for item in content
            )
        except Exception as e:
            print(
                f"_normalize_content: Failed to stringify list items: {e}"
            )
            return ""
    else:
        print(
            f"_normalize_content: Unsupported content type: {type(content)}"
        )
        return ""


def invoke_model(
    prompt: str,
    prompt_key: str = "",
    temperature: float = 0.0,
) -> Any | None:
    """
    Invoke the model with a prompt and safely parse the response as JSON.

    Args:
        prompt (str): The formatted prompt string.
        prompt_key (str): Optional key for debug messages or error logs.
        temperature (float): Sampling temperature for model creativity.

    Returns:
        Parsed JSON object (list or dict), or None on failure.
    """
    model = create_llm(temperature=temperature)

    try:
        result = model.invoke(prompt)
        raw_content = _normalize_content(result.content)
        cleaned = _extract_json(raw_content)

        if not cleaned:
            print(
                f"invoke_model_with_json[{prompt_key}]: No JSON detected in response"
            )
            return None

        return json.loads(cleaned)

    except json.JSONDecodeError as e:
        print(
            f"invoke_model_with_json[{prompt_key}]: JSON decode error: {e}"
        )
    except Exception as e:
        print(
            f"invoke_model_with_json[{prompt_key}]: Unexpected error: {e}"
        )

    return None
