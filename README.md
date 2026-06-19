# Nexus AI - Intelligent Support Agent

![Nexus AI Header](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6F00?style=for-the-badge) 

Nexus AI is a highly-transparent, RAG-powered (Retrieval-Augmented Generation) customer support agent. Built with a premium, minimalist "Dark + Lime Yellow" aesthetic, it acts as a fully grounded support tier capable of answering queries strictly based on provided documentation, surfacing exact retrieval citations, and seamlessly escalating complex issues into a ticketing system.

---

## ✨ Key Features

- **Document-Grounded RAG:** Answers are generated strictly from embedded markdown documentation using `sentence-transformers/all-MiniLM-L6-v2`. Hallucinations are actively prevented via strict prompt engineering.
- **Retrieval Transparency:** Expandable citation cards reveal the exact raw chunk of text retrieved from the Vector Database.
- **Intelligent Intent Routing:** Automatically detects whether a user is asking a question or attempting to log a support ticket.
- **Integrated Ticketing Workflow:** Users can escalate issues via a beautiful, glassmorphic modal or through natural language. Tickets are persistently tracked via a backend JSON datastore.
- **Developer Metrics Mode:** A togglable sidebar exposes under-the-hood metrics including LLM Response Latency, Retrieved Chunk Count, Vector DB stats, and the active LLM Provider.
- **Premium UI/UX:** Features a custom mathematical scroll-progress timeline, dynamic typing indicators, and a clean, conversational UI devoid of unnecessary clutter.

---

## 🛠️ Technology Stack

### Backend
- **Framework:** FastAPI
- **Vector Database:** ChromaDB
- **Embeddings:** `sentence-transformers/all-MiniLM-L6-v2`
- **LLM Routing:** OpenRouter API (Defaulting to `deepseek/deepseek-chat` / DeepSeek V3)
- **Data Persistence:** JSON-based ticket storage (`tickets.json`)

### Frontend
- **Framework:** React.js (via Vite)
- **Styling:** Vanilla CSS (Zero-dependency custom design system)
- **Animations:** Framer Motion
- **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- An OpenRouter API Key

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Nexus-AI
```

### 2. Backend Setup
Navigate to the backend directory and set up your virtual environment:
```bash
cd backend
python -m venv venv
# On macOS/Linux: source venv/bin/activate
# On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
LLM_PROVIDER=openrouter
LLM_MODEL=deepseek/deepseek-chat
OPENROUTER_API_KEY=your_api_key_here
```

Start the FastAPI server:
```bash
uvicorn app:app --reload
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 📖 Usage Guide

1. **Ask Questions:** Try asking "How do I change my password?" The AI will parse `account.md`, retrieve the exact steps, and render them in a structured list.
2. **Inspect Sources:** Click the downward chevron on the Citation Card below the AI's response to see the exact database chunk that informed the answer.
3. **Open Dev Tools:** Click **⚙ Developer Mode** in the top right to view real-time latency, Vector DB health, and active provider configuration.
4. **Create a Ticket:** If the AI cannot solve your issue, click the **Create Support Ticket** button underneath the response, or simply type "I need to open a ticket regarding my broken dashboard."

---

## 📂 Directory Structure

```text
├── backend/
│   ├── data/                 # Documentation (MD files) & tickets.json
│   ├── models/               # Pydantic validation models
│   ├── services/
│   │   ├── document_loader.py # Markdown parsing and chunking
│   │   ├── llm_service.py     # Provider-agnostic LLM caller
│   │   ├── rag_service.py     # Core RAG pipeline & prompt engineering
│   │   ├── retriever.py       # ChromaDB querying logic
│   │   ├── router.py          # Intent classification
│   │   └── ticket_service.py  # Ticket CRUD operations
│   ├── app.py                # FastAPI endpoints
│   └── config.py             # Environment variable management
└── frontend/
    ├── src/
    │   ├── services/         # API fetch calls (api.js)
    │   ├── App.css           # Custom Design System
    │   ├── App.jsx           # Main React Application
    │   └── main.jsx          # React Entry Point
    └── package.json
```
