
# CyberForge

> Open source cybersecurity assistant powered by LLMs — audit, improve, and secure your organizational policies.

## ✨ Overview

**CyberForge** helps you analyze and improve your company’s cybersecurity policies using large language models (LLMs). Get deep insights aligned with recognized frameworks such as **NIST, CIS Controls,** and **PIPEDA**.

## 🚀 Features

- 🔍 Analyze policies against frameworks like NIST, CIS, and PIPEDA
- 📊 Visual scores for each control and top identified threats
- 📄 Suggested improvements to your uploaded documents
- 🤖 Context-aware agent assistant powered by your own documents
- 🔌 Flexible LLM support (OpenAI, Cohere or any compatible model)

## 🔧 Prerequisites

Before you get started, you’ll need:

| Tool / Requirement                        | Description                                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Git                                       | Required to clone the repository: [Git](https://git-scm.com/)                                            |
| OpenAI or Cohere API key                  | OpenAI: [platform.openai.com](https://platform.openai.com/account/api-keys)<br>Cohere: [cohere.com](https://cohere.com/) |
| PDF Policies                              | You'll need your policies in `.pdf` format to analyze. If you don’t have any, sample policies are provided directly in the CyberForge application to use.|


> 📃 If you wish to create your own policies for your organization, templates and government guides are provided in the ***guides*** folder.

## 📦 Cloning the Repository

To clone the repository, navigate to a new terminal instance, and run the following commands.

```bash
git clone https://github.com/tidalpoint/cyberforge.git
cd cyberforge
```

## 🔑 Obtaining an API Key

An API key from either OpenAI or Cohere is a requirement to use CyberForge.

### OpenAI API Keys

To obtain an OpenAI API key, please navigate to the following document for step-by-step instructions.

[![Create OpenAI API Key](https://img.shields.io/badge/Create_OpenAI-API_Key-5A3EBA?style=for-the-badge&logo=openai&logoColor=white)](openai.md)

> 💰 Please note that you must purchase credits or add your payment details in order to use OpenAI models.

### Cohere API Keys

To obtain a Cohere API key, please navigate to the following document for step-by-step instructions.

[![Create Cohere API Key](https://img.shields.io/badge/Create_Cohere-API_Key-5A3EBA?style=for-the-badge&logo=cohere&logoColor=white)](cohere.md)

> 💰 Please note that free trial API keys have rate limits, and to use CyberForge to its full potential, a paid production key is required.


## 🐳 Install with Docker

- You will first need to install the Docker Desktop app ([https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/))

<img width="1479" alt="Screenshot 2025-06-18 at 3 59 41 PM" src="https://github.com/user-attachments/assets/84e6a787-5e80-4f80-8b11-c280e374c707" />

### Make sure your API keys are set as environment variables:

- Environment variables allow the operating system to read in the API keys and use them in the application. 

Rename .env.example (located in the root of the project) to .env and add in your API key(s).

<img width="399" alt="Screenshot 2025-06-20 at 2 59 15 PM" src="https://github.com/user-attachments/assets/fb107d0c-45c8-4cec-ae26-4ace16b69654" />

Fill in the "" portion with the actual API key(s).

<img width="192" alt="Screenshot 2025-06-18 at 1 52 54 PM" src="https://github.com/user-attachments/assets/d17d9d26-6b69-4fb0-8496-f9a85dbf88d9" />

----- OR -----

Set the environment variables by typing the following commands into a new terminal instance and fill in the "" portion with the actual API key.

```
Windows:
$Env:OPENAI_API_KEY=""

Mac/Linux:
export OPENAI_API_KEY=""
```

### Start with Docker

Once the environment variables are set, run the following command to start the application. 

```bash
docker compose up
```

### App Navigation

- Navigate to [localhost:5173](http://localhost:5173) to see CyberForge in action!

## 🛠️ Install Manually

- You will need to have the following installed:
  - Node.js 20+ ([https://nodejs.org/en/download](https://nodejs.org/en/download))
  - Python 3.12+ ([https://www.python.org/downloads/](https://www.python.org/downloads/))
 
### Same as above, please make sure your API keys are set as environment variables:

Rename .env.example (located in the root of the project) to .env.

<img width="399" alt="Screenshot 2025-06-20 at 2 59 15 PM" src="https://github.com/user-attachments/assets/fb107d0c-45c8-4cec-ae26-4ace16b69654" />

Fill in the "" portion with the actual API key(s).

<img width="192" alt="Screenshot 2025-06-18 at 1 52 54 PM" src="https://github.com/user-attachments/assets/d17d9d26-6b69-4fb0-8496-f9a85dbf88d9" />

----- OR -----

Set the environment variables by typing the following commands into a new terminal instance and fill in the "" portion with the actual API key.

```
Windows:
$Env:OPENAI_API_KEY=""

Mac/Linux:
export OPENAI_API_KEY=""
```

- Now, please ensure you are in the root of the project.

Frontend: installs dependencies and starts on [localhost:5173](http://localhost:5173) by default

```bash
npm install -g yarn

cd frontend

yarn
yarn dev
```

- Open a new terminal instance, and ensure you are in the root of the project.

Backend: installs dependencies and starts on [localhost:9009](http://localhost:9009) by default

```bash
cd backend

Windows:
python -m venv .venv
.venv/Scripts/activate

Mac/Linux:
python3 -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

### App Navigation

- Navigate to [localhost:5173](http://localhost:5173) to see CyberForge in action!

## 🛠️ Usage

1. **Upload your policies** (PDF only)
   - Don’t have any policies? You can:
     - Demo with our sample documents from a fictitious Finance company “Maple Trust”. Simply click *Use Sample Documents* on the home page of CyberForge.
     - Use our provided policy templates and government guides, located in the in the ***guides*** folder, to create your own policies for your organization.
2. **Select a cybersecurity framework**:
   - NIST CSF
   - SMO Controls
   - CIS Controls
3. **Review outputs**:
   - 🧠 Top Threats
   - 📈 Control Scores - with suggested actions to improve
   - 📑 Suggested document improvements
   - 🍁 PIPEDA Results
   - 💬 Chat with the AI assistant for policy questions
4. **Wish to restart?**
   - Simply navigate back to [localhost:5173/onboarding](http://localhost:5173/onboarding) to restart.
   - Please note that once you restart, the PDFs you've uploaded are reset, and you will have to upload a new set of policies.

> ⚠️ If the frontend or backend process is killed and then started again, the PDFs are also reset, and you will have to upload a new set of policies.

> 📋 Chat history is preserved across sessions and restarts - allowing you to have a comprehensive overview of your chats at all times. 

## 🔩 Switching LLM Models and Providers

> ⚠️ We suggest using OpenAI's GPT-4o and GPT-4o-mini models, and Cohere's Command A and Command R models. However, you can experiment with other OpenAI and Cohere models as you prefer.

- To switch the LLM provider being used, navigate to ```config.py``` and switch the **DEFAULT_PROVIDER** variable to either **openai** or **cohere**.
- Similarly, to switch the LLM being used, navigate to ```config.py``` and switch the ***openai*** or **cohere** entry in the **DEFAULT_MODELS** variable to a model of your choice (e.g. gpt-4o, gpt-4o-mini, command-r, command-r-plus, etc).
  
<img width="484" alt="Screenshot 2025-05-28 at 3 27 53 PM" src="https://github.com/user-attachments/assets/2894f576-06c8-498c-bc60-9fa108d1d1b0" />

## 📷 Screenshots

![Onboarding - Upload Documents](https://github.com/user-attachments/assets/20e6edee-cb37-4a90-9530-7cfbad7ddc92)  
*Figure 1: Onboarding – Upload Documents*

![Onboarding - Select Framework](https://github.com/user-attachments/assets/b5b14d32-d76a-4884-849b-229aef4389b1)  
*Figure 2: Onboarding – Select Framework*

![Home Page](https://github.com/user-attachments/assets/5456db30-f536-4143-a7f4-59753141ccf7)  
*Figure 3: Home Page*

![Compliance Page](https://github.com/user-attachments/assets/9d16fc62-cba7-4c49-a9c6-446b0358dd52)  
*Figure 4: Compliance Page*

![Control Page](https://github.com/user-attachments/assets/85d2cc5a-a5ce-4aff-be0f-0bb2ecc2d1ff)  
*Figure 5: Control Page*

![Policy Improver](https://github.com/user-attachments/assets/599fe8cb-d5d4-45a5-adf9-5f47804c1a1a)

*Figure 6: Policy Improver*

![PIPEDA Results](https://github.com/user-attachments/assets/f0749ba6-f9e0-4f5d-99ed-a94363c9ac41)  
*Figure 7: PIPEDA Results*

![Chat Assistant](https://github.com/user-attachments/assets/75aec415-5deb-4e08-999b-29ba9abaf561)  
*Figure 8: Chat Assistant*

## 📣 Additional Info

CyberForge has two other variations, customized to your needs:

- For a simple RAG chat assistant application, Estel, please navigate to the following document to learn how to set it up!

[![Estel](https://img.shields.io/badge/Estel-5A3EBA?style=for-the-badge&logo=cohere&logoColor=white)](estel.md)

- For a lightweight version of CyberForge (without control score analysis) running on a free, self-hosted LLM (Mistral), please navigate to the following repository to set it up!
  
[![CyberForge-ember Repository](https://img.shields.io/badge/CyberForge-ember-5A3EBA?style=for-the-badge&logo=cohere&logoColor=white)](https://github.com/tidalpoint/cyberforge-ember-internal)


## 📄 License

MIT ©️ Tidal Point Software
