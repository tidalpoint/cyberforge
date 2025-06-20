from langchain_core.tools import tool

from core import expert_knowledge


@tool
def get_expert_knowledge(message: str) -> str:
    """
    Use this tool to retrieve expert knowledge about specific cybersecurity tools and practices, including frameworks like NIST, CIS, etc.
    The tool will access a knowledge base to provide relevant information created by cybersecurity experts.
    In any case where you need to know about cybersecurity tools, practices, or frameworks, use this tool.
    Some questions that this tool would help with include:
    - What are the best practices for implementing a NIST framework?
    - How can I ensure compliance with CIS benchmarks?
    - What are the key components of a cybersecurity risk management strategy?
    """
    print("Using get_expert_knowledge tool")

    return expert_knowledge(message)
