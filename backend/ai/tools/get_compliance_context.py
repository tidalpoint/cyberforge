from langchain_core.tools import tool

import globals


@tool
def get_compliance_context() -> list[dict]:
    """
    Use this tool to retrieve the organization's current compliance status.
    It returns control names, descriptions, compliance scores, and reasoning for each control.
    Helpful for questions like: "How are we doing in Identify?" or "What controls need improvement?"
    """
    print("Using get_compliance_context tool")

    return [
        {
            "id": control["id"],
            "name": control["name"],
            "description": control["description"],
            "score": control["score"],
            "reason": control["reason"],
        }
        for control in globals.csf_compliance.values()
    ]
