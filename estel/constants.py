# constants.py
import os
from dotenv import load_dotenv

load_dotenv()

# constants.py

PERSIST_DIR = "vectorstore_index"
MODEL_NAME = "gpt-4o-mini"
EMBEDDING_MODEL = "text-embedding-ada-002"
# OpenAI model
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Vectorstore path
DB_FAISS_PATH = "vectorstore_index"
