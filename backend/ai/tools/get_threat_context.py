from langchain_core.tools import tool

import globals


@tool
def get_threat_context() -> list[dict]:
    """
    Use this tool to retrieve the top cybersecurity threats currently facing the organization.
    It returns a ranked list of threats including their names, descriptions, impact reasoning, and risk scores.
    Useful for questions like: "What are our top threats?" or "What risks should we be most concerned about?"
    """
    print("Using get_threat_context tool")

    return [
        {k: v for k, v in threat.items() if k != "controls"}
        for threat in globals.top_5_threats
    ]
