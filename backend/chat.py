import json
import os
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from langgraph.prebuilt import create_react_agent

import globals
from ai.models import create_llm
from ai.tools import tools

agent = create_react_agent(create_llm(temperature=0.5), tools)


def get_chat_threads() -> list[dict[str, object]]:
    """Retrieve all chat threads from the chat directory."""
    chat_threads = []

    # Ensure the directory exists
    if not os.path.exists(globals.CHAT_FOLDER):
        # Create the directory if it doesn't exist
        os.makedirs(globals.CHAT_FOLDER, exist_ok=True)
        print(f"Chat directory {globals.CHAT_FOLDER} created.")

    # Iterate over each file in the chat directory
    for filename in os.listdir(globals.CHAT_FOLDER):
        file_path = os.path.join(globals.CHAT_FOLDER, filename)

        # Only process JSON files
        if os.path.isfile(file_path) and filename.endswith(".json"):
            with open(file_path) as f:
                try:
                    chat_data = json.load(f)

                    chat_thread = {
                        "id": chat_data.get("id"),
                        "title": chat_data.get("title"),
                        "createdAt": chat_data.get("createdAt"),
                        "updatedAt": chat_data.get("updatedAt"),
                    }

                    chat_threads.append(chat_thread)
                except json.JSONDecodeError:
                    print(f"Warning: Could not decode JSON from {file_path}")

    return chat_threads


def get_chat_thread(thread_id: str):
    file_path = Path(globals.CHAT_FOLDER) / f"{thread_id}.json"

    if not file_path.exists():
        raise FileNotFoundError(f"Chat thread {thread_id} does not exist.")

    try:
        with file_path.open() as f:
            return json.load(f)["messages"]
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON in thread file: {file_path}")


def send_message(message: str, thread_id: str) -> str:
    """Send a message to an existing chat thread and persist the updated data."""

    file_path = Path(globals.CHAT_FOLDER) / f"{thread_id}.json"

    if not file_path.exists():
        raise FileNotFoundError(f"Chat thread {thread_id} does not exist.")

    try:
        with file_path.open("r") as f:
            thread = json.load(f)
    except json.JSONDecodeError:
        raise ValueError(f"Corrupted thread: could not decode JSON from {file_path}")

    previous_messages = [message["content"] for message in thread["messages"]]
    messages = [globals.SYSTEM_PROMPT] + previous_messages + [message]

    agent = create_react_agent(create_llm(temperature=0.5), tools)
    agent_reply = agent.invoke({"messages": messages})["messages"][-1].content

    thread["messages"].extend(
        [
            shape_message(message, is_user=True),
            shape_message(agent_reply, is_user=False),
        ]
    )

    with file_path.open("w") as f:
        json.dump(thread, f)

    return agent_reply


def shape_message(message: str, is_user: bool):
    """Shape a chat message into structured format."""
    current_time = datetime.now().astimezone().isoformat(timespec="milliseconds")

    return {
        "id": str(uuid4()),
        "content": message.strip(),
        "isUser": is_user,
        "createdAt": current_time,
        "updatedAt": current_time,
    }


def create_chat_thread(message: str):
    """Create a new chat thread with initial message and agent reply."""
    agent = create_react_agent(create_llm(temperature=0.5), tools)
    agent_reply = agent.invoke({"messages": [globals.SYSTEM_PROMPT, message]})[
        "messages"
    ][-1].content

    thread_title = generate_thread_title(message)
    current_time = datetime.now().astimezone().isoformat(timespec="milliseconds")

    thread = {
        "id": str(uuid4()),
        "title": thread_title,
        "createdAt": current_time,
        "updatedAt": current_time,
        "messages": [shape_message(message, True), shape_message(agent_reply, False)],
    }

    os.makedirs(globals.CHAT_FOLDER, exist_ok=True)
    with open(os.path.join(globals.CHAT_FOLDER, f"{thread['id']}.json"), "w") as f:
        json.dump(thread, f)

    return {"thread_id": thread["id"], "title": thread_title, "reply": agent_reply}


def generate_thread_title(message: str) -> str:
    """Generate a title for the chat thread based on the initial message."""

    prompt_content = (
        f"Return your answer as text with no quation marks at the beginning or end. \n\n"
        f"Analyze the following message and generate a short, descriptive title:\n\n"
        f"Message: {message}\n\n"
        f"Title:"
    )

    return agent.invoke({"messages": [prompt_content]})["messages"][-1].content
