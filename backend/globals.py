from langchain_community.vectorstores import FAISS

CONTROLS_DIR = "./csf_controls"
IMPROVED_DOCS_DIR = "./improved_docs"
EXPERT_KNOWLEDGE_FOLDER = "expert_docs"
CHAT_FOLDER = "chats"
UPLOAD_FOLDER = "input_docs"

THREATS_FILE_PATH = "threats.json"

VECTOR_DB_FOLDER = "vector_db"
EXPERT_KNOWLEDGE_VECTOR_DB_FOLDER = "expert_knowledge_vector_db"

SYSTEM_PROMPT = "You are a helpful cybersecurity assistant called Orisa. You were developed by Tidal Point Software as part of the open-source project CyberForge."

SUPPORTED_INDUSTRIES = [
    "finance",
    "healthcare",
    "retail",
    "government",
    "technology",
    "manufacturing",
    "utilities",
    "infrastructure",
]
SUPPORTED_THREATS = ["cloud", "identity", "nation-state", "ransomware", "supply-chain"]
SUPPORTED_FRAMEWORKS = ["NIST", "SMB", "CIS_IG1"]

CHUNK_SIZE = 500
CHUNK_OVERLAP = 100

INDUSTRY_TO_THREATS = {
    "finance": ["cloud", "identity", "nation-state", "ransomware", "supply-chain"],
    "healthcare": ["cloud", "identity", "data-breach", "ransomware", "supply-chain"],
    "retail": ["cloud", "identity", "malware", "ransomware", "supply-chain"],
    "government": ["cloud", "identity", "data-breach", "nation-state", "supply-chain"],
    "technology": ["cloud", "identity", "ip-theft", "ransomware", "supply-chain"],
    "manufacturing": ["ip-theft", "identity", "nation-state", "ransomware", "supply-chain"],
    "utilities": ["cloud", "identity", "nation-state", "ransomware", "supply-chain"],
    "infrastructure": ["cloud", "identity", "nation-state", "ransomware", "supply-chain"],
}

# These globals get overwritten at runtime
current_csf = None
csf_compliance = {}
top_5_threats = []
csf_controls = {}

vector_store: FAISS | None
expert_knowledge_vector_store: FAISS | None
input_docs = {}
improved_docs = []

questionnaire_result = None
num_controls_evaluated = 0
