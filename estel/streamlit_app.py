import streamlit as st
from rag_utils import load_documents, create_vectorstore
from chat_utils import get_chain
from constants import PERSIST_DIR
import os

# Initialize session state
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

if "chat_chain" not in st.session_state:
    st.session_state.chat_chain = None

# App title
st.set_page_config(page_title="Simple RAG Chat")
st.title("RAG Chat with Estel 🤖")

# Tabs
tabs = st.tabs(["📄 Upload & Index", "💬 Ask Estel", "📚 Chat History"])

# Tab 1: Upload & Index
with tabs[0]:
    st.subheader("Upload documents for Estel to read")
    uploaded_files = st.file_uploader("Upload PDF or TXT files", type=["pdf", "txt"], accept_multiple_files=True)

    if st.button("📥 Process Documents") and uploaded_files:
        with st.spinner("Loading and indexing documents..."):
            docs = load_documents(uploaded_files)
            vectorstore = create_vectorstore(docs)
            st.session_state.chat_chain = get_chain(vectorstore)
            st.success("Documents successfully processed and indexed!")

# Tab 2: Ask Estel
with tabs[1]:
    st.subheader("Ask Estel")

    # Show full chat history
    for i, (user_prompt, response) in enumerate(st.session_state.chat_history):
        st.markdown(f"**You:** {user_prompt}")
        st.markdown(f"**Estel:** {response}")

    # Input box at the bottom
    prompt = st.chat_input("Ask a question about the documents...")
    if prompt:
        chain = st.session_state.get("chat_chain")
        if chain:
            result = chain.invoke({"query": prompt})
            answer = result["result"]
            st.session_state.chat_history.append((prompt, answer))
            # Show immediate result
            st.markdown(f"**You:** {prompt}")
            st.markdown(f"**Estel:** {answer}")
        else:
            st.error("Please upload and process documents first.")

# Tab 3: Full Chat History
with tabs[2]:
    st.subheader("Chat History with Estel")
    if not st.session_state.chat_history:
        st.info("No questions asked yet.")
    else:
        for i, (user_prompt, response) in enumerate(st.session_state.chat_history):
            st.markdown(f"**You:** {user_prompt}")
            st.markdown(f"**Estel:** {response}")
