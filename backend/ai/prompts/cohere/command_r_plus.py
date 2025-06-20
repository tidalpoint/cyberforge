from ..openai.gpt_4o import PROMPTS as BASE_PROMPTS
from ..utils import create_prompt_dict

PROMPTS = create_prompt_dict(base=BASE_PROMPTS)
