 # ✨ Estel

> Simple RAG chat assistant powered by OpenAI — upload, chat, and audit directly from your docs.

## 🚀 Features

- 🔍 Analyze documents in-depth with contextual understanding
- 🤖 Chat with Estel, a document-aware AI agent
- 📁 Seamless document upload and indexing (PDF + TXT files)
- 🔌 Supports OpenAI models (GPT-4o, GPT-4o-mini, etc)

## 🛠️ Prerequisite

For the Estel sample project, it only supports OpenAI API keys. For more information on how to create an OpenAI API key, please navigate to the following document for step-by-step instructions.

[![Create OpenAI API Key](https://img.shields.io/badge/Create_OpenAI-API_Key-5A3EBA?style=for-the-badge&logo=openai&logoColor=white)](openai.md)

> 💰 Please note that you must purchase credits or add your payment details in order to use OpenAI models.

## 🧰 Setup

Please make sure you are in the root of the CyberForge project. We will navigate to the folder that contains Estel.

```bash
cd estel
```

### Make sure your OpenAI API key is set as an environment variable:

Rename .env.example (located in the Estel folder) to .env.

<img width="396" alt="Screenshot 2025-06-20 at 10 48 11 AM" src="https://github.com/user-attachments/assets/56ac43da-202b-47c5-a5c4-71f6c9506501" />

Fill in the "" portion with the actual API key.

<img width="229" alt="Screenshot 2025-06-20 at 10 48 51 AM" src="https://github.com/user-attachments/assets/0f40ebd7-8333-4689-8971-b272c77f180e" />

### Starting Estel

Now, we will install the required dependencies and start up Estel. 
```bash
Windows:
python -m venv .venv
.venv/Scripts/activate

Mac/Linux:
python3 -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt
streamlit run streamlit_app.py
```

### App Navigation

Navigate to localhost:8501 to see Estel in action!

## 🛠️ Usage

1. **Upload your documents** (PDF and TXT only)
    - These documents will now serve as part of the RAG.
    - You can always upload more documents by navigating back to the *Upload & Index* tab.
2. **Interact with Estel 💬**:
    - 🧠 Ask questions about your documents
    - 📑 Navigate to the *Chat History* tab to view past chats.

> ⚠️ If the app process is killed and then started again, the documents are reset, and you will have to upload a new set of documents.

> 📋 Chat history is not preserved across sessions - once the app process is killed at all times.


## 🔩 Switching LLM Models and Providers

> ⚠️ We suggest using OpenAI's GPT-4o and GPT-4o-mini models. However, you can experiment with other OpenAI as you prefer.

- To switch the LLM  being used, navigate to ```constants.py``` and switch the **MODEL_NAME** variable to a model of your choice (e.g. gpt-4o, gpt-4o-mini, etc).

<img width="412" alt="Screenshot 2025-06-19 at 2 54 58 PM" src="https://github.com/user-attachments/assets/4f9d1352-8f93-4f8c-93ef-a630aee72959" />


## 📷 Screenshots

![Home Page](https://github.com/user-attachments/assets/3743ffac-3bca-4a1c-b05d-f31fd479ea41)
*Figure 1: Home Page + Upload Documents*

![Process Documents](https://github.com/user-attachments/assets/d9f2ef45-a944-433b-8a94-0a06c4ab1e13)

*Figure 2: Process Documents*

![Interactive Chat with Estel](https://github.com/user-attachments/assets/711b1bce-aeb9-45d5-9c7e-47bc79f56073)

*Figure 3: Interactive Chat with Estel*

![Chat History](https://github.com/user-attachments/assets/0844079a-478e-4913-b56b-717de3689a08)

*Figure 4: Chat History*


## 📄 License
MIT ©️ Tidal Point Software
