# LLMMatch — Intelligent LLM Recommendation System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-00a393.svg)
![React](https://img.shields.io/badge/React-18.3+-61dafb.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

**Find Your Perfect LLM in Seconds**

An intelligent recommendation system that automatically identifies the most suitable Large Language Model based on your specific requirements — task type, budget, latency, context length, and deployment constraints.

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Docs](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [How It Works](#-how-it-works)
- [Dataset](#-dataset)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Team](#-team)

---

## 🎯 About

**LLMMatch** solves a critical problem in modern AI development: **choosing the right LLM from 200+ available models**. 

With the explosion of LLMs (GPT-4, Claude, Gemini, Llama, Mistral, etc.), selecting the optimal model for a specific use case has become increasingly complex. Developers and teams waste valuable time researching costs, performance benchmarks, and capabilities across scattered documentation.

**LLMMatch** provides an intelligent, automated solution that:
- ✅ Takes your requirements as input (task, budget, latency, context, deployment)
- ✅ Scores and ranks all available LLMs using a weighted algorithm
- ✅ Returns top 3 recommendations with detailed explanations
- ✅ Optionally enhances predictions using machine learning

---

## ✨ Features

### 🔍 **Intelligent Recommendation Engine**
- Multi-parameter scoring algorithm with priority-based weighting
- Considers task type, cost constraints, latency requirements, context window, and deployment preferences
- Returns top 3 LLMs ranked by suitability score (0-100)

### 💬 **Explainable AI**
- Every recommendation includes natural language explanation
- Transparent reasoning: "GPT-4o-mini scores 92/100 because it fits your $5 budget ($0.15 actual), excels at code tasks (0.88 score), supports 128k context..."
- Cost, speed, and capability breakdowns

### 📊 **Comprehensive Knowledge Base**
- 20+ LLM models from major providers (OpenAI, Anthropic, Google, Meta, Mistral, etc.)
- Real-time pricing data per 1M tokens
- Context window sizes (4k → 2M tokens)
- Latency classifications (realtime / moderate / batch)
- Task-specific capability scores

### 🤖 **Optional ML Enhancement**
- RandomForest classifier trained on synthetic requirement patterns
- Enhances prediction accuracy for complex scenarios
- Fallback to rule-based scoring for reliability

### 🎨 **Modern UI/UX**
- Multi-step wizard for requirement collection
- Interactive result cards with animated score bars
- Browse all models in sortable, filterable table
- Fully responsive design

---

## 🛠️ Tech Stack

### **Backend**
- **Framework:** FastAPI (Python 3.10+)
- **Server:** Uvicorn (ASGI)
- **Validation:** Pydantic v2
- **ML:** scikit-learn (RandomForestClassifier)
- **Data:** pandas, numpy
- **Persistence:** joblib

### **Frontend**
- **Framework:** React 18.3+
- **Build Tool:** Vite
- **Styling:** CSS Modules (no Tailwind)
- **HTTP Client:** Axios
- **Routing:** React Router v6

### **Data Layer**
- **Storage:** JSON knowledge base
- **No external database required**

---

## 🚀 Quick Start

### Prerequisites
```bash
# Required
- Python 3.10+
- Node.js 18+ & npm
- Git
```

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/manivuppala124/LLMFinder.git
cd LLMFinder
```

#### 2️⃣ Backend Setup
```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

#### 3️⃣ Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 📂 Project Structure

```
LLMFinder/
├── backend/                    # FastAPI backend
│   ├── main.py                # FastAPI app + routes
│   ├── models.py              # Pydantic schemas
│   ├── scorer.py              # Weighted scoring engine
│   ├── ml_model.py            # RandomForest ML model
│   ├── knowledge_base.json    # LLM characteristics data
│   ├── trained_model.pkl      # Saved ML model (auto-generated)
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ModelCard.jsx
│   │   │   └── ScoreBar.jsx
│   │   ├── pages/             # Route pages
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── Form.jsx       # Multi-step wizard
│   │   │   ├── Results.jsx    # Recommendation results
│   │   │   └── Models.jsx     # All models table
│   │   ├── styles/            # CSS modules
│   │   ├── utils/
│   │   │   └── api.js         # Axios instance
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── tests/                      # Test suite
├── test_reports/               # Test results
├── memory/                     # Session persistence
├── design_guidelines.json      # UI/UX design system
└── README.md                   # This file
```

---

## 📡 API Documentation

### **Base URL:** `http://localhost:8000`

### Endpoints

#### 1. **POST** `/api/recommend`
Get top 3 LLM recommendations based on requirements.

**Request Body:**
```json
{
  "task_type": "code",
  "budget_per_1m": 5.0,
  "latency": "moderate",
  "context_length": 128000,
  "deployment": "cloud",
  "priority": "balanced"
}
```

**Response:**
```json
{
  "top_model": {
    "name": "GPT-4o-mini",
    "provider": "OpenAI",
    "score": 92.0,
    "cost_score": 95.0,
    "speed_score": 88.0,
    "capability_score": 92.0,
    "explanation": "GPT-4o-mini scores 92/100. It fits your $5 budget ($0.15 actual)...",
    "tags": ["gpt", "fast", "affordable"],
    "link": "https://openai.com/api/pricing"
  },
  "alternatives": [
    { /* Alternative 1 */ },
    { /* Alternative 2 */ }
  ],
  "method_used": "scoring"
}
```

#### 2. **GET** `/api/models`
Retrieve all available LLMs from knowledge base.

**Response:**
```json
[
  {
    "name": "GPT-4o",
    "provider": "OpenAI",
    "cost_input_per_1m": 2.5,
    "cost_output_per_1m": 10.0,
    "context_window": 128000,
    "latency_class": "realtime",
    "deployment": ["cloud"],
    "task_scores": {
      "code": 0.95,
      "chat": 0.92,
      "summarize": 0.88,
      "analysis": 0.94,
      "translation": 0.85,
      "rag": 0.90
    },
    "tags": ["gpt", "multimodal", "premium"],
    "link": "https://openai.com/api/pricing"
  }
  // ... more models
]
```

#### 3. **GET** `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

---

## ⚙️ How It Works

### Workflow Overview

```
User Fills Form → Frontend Sends Request → Backend Scores All LLMs → Returns Top 3
```

### Scoring Algorithm

The system uses a **weighted scoring mechanism** that adapts based on user priority:

#### 1. **Priority-Based Weights**
```python
if priority == "cost":
    weights = {"cost": 0.5, "speed": 0.2, "capability": 0.3}
elif priority == "speed":
    weights = {"cost": 0.2, "speed": 0.5, "capability": 0.3}
elif priority == "intelligence":
    weights = {"cost": 0.1, "speed": 0.2, "capability": 0.7}
else:  # balanced
    weights = {"cost": 0.33, "speed": 0.33, "capability": 0.34}
```

#### 2. **Component Scores** (0-100 scale)

**Cost Score:**
```python
if user_budget >= llm_cost:
    cost_score = 100
else:
    cost_score = (user_budget / llm_cost) * 100
```

**Speed Score:**
```python
if user_latency == llm_latency:
    speed_score = 100
elif compatible:
    speed_score = 70
else:
    speed_score = 40
```

**Capability Score:**
```python
capability_score = llm.task_scores[user_task_type] * 100
```

#### 3. **Total Score**
```python
total_score = (weights["cost"] * cost_score + 
               weights["speed"] * speed_score + 
               weights["capability"] * capability_score)
```

#### 4. **Explanation Generation**
Automatically generates natural language explanation:
```
"GPT-4o-mini scores 92/100. It fits your $5 budget ($0.15 actual cost), 
excels at code generation tasks (0.88 capability score), supports 128k 
context window, and is available as a cloud API."
```

---

## 📊 Dataset

### Knowledge Base Structure

The `knowledge_base.json` contains 20+ LLMs with the following schema:

```json
{
  "name": "string",              // Model name
  "provider": "string",          // OpenAI, Anthropic, Google, etc.
  "cost_input_per_1m": float,   // USD per 1M input tokens
  "cost_output_per_1m": float,  // USD per 1M output tokens
  "context_window": int,         // Maximum tokens (4096 to 2000000)
  "latency_class": "string",     // realtime | moderate | batch
  "deployment": ["string"],      // cloud | local | both
  "task_scores": {
    "code": float,               // 0.0 to 1.0
    "chat": float,
    "summarize": float,
    "analysis": float,
    "translation": float,
    "rag": float
  },
  "tags": ["string"],
  "link": "string"               // Documentation URL
}
```

### Included Models (20+)

| Model | Provider | Cost/1M | Context | Best For |
|---|---|---|---|---|
| GPT-4o | OpenAI | $5.00 | 128k | General, Multimodal |
| GPT-4o-mini | OpenAI | $0.15 | 128k | Cost-effective |
| Claude 3.5 Sonnet | Anthropic | $3.00 | 200k | Analysis, Long context |
| Claude 3 Haiku | Anthropic | $0.25 | 200k | Speed, Cost |
| Gemini 1.5 Pro | Google | $3.50 | 2M | Extreme context |
| Gemini 1.5 Flash | Google | $0.075 | 1M | Fast, Affordable |
| Llama 3.1 70B | Meta | $0.59 | 128k | Open-source |
| Llama 3.1 8B | Meta | $0.05 | 128k | Local deployment |
| DeepSeek Coder V2 | DeepSeek | $0.14 | 128k | Code generation |
| Mistral 7B | Mistral | $0.06 | 32k | Open-source |
| ... | ... | ... | ... | ... |

### Data Sources

- **Pricing:** [OpenRouter](https://openrouter.ai/models), [LiteLLM GitHub](https://github.com/BerriAI/litellm)
- **Performance:** [Artificial Analysis](https://artificialanalysis.ai), [HuggingFace Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard)
- **Specifications:** Official provider documentation

---

## 🧪 Testing

### Run Tests
```bash
cd tests
pytest
```

### Test Reports
Test results are saved in `test_reports/` directory.

---

## 🚢 Deployment

### Backend (FastAPI)

#### Option 1: Render.com
```bash
# render.yaml
services:
  - type: web
    name: llmmatch-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### Option 2: Railway
```bash
# Railway auto-detects FastAPI
# Just connect your GitHub repo
```

### Frontend (React)

#### Vercel
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

#### Netlify
```bash
# Build command: npm run build
# Publish directory: dist
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork the Repository
```bash
git clone https://github.com/YOUR_USERNAME/LLMFinder.git
cd LLMFinder
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Add new LLM models to `knowledge_base.json`
- Improve scoring algorithm in `scorer.py`
- Enhance UI components in `frontend/src/`

### 4. Test Your Changes
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### 5. Submit Pull Request
```bash
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name
```

### Contribution Ideas
- ✅ Add more LLM models to knowledge base
- ✅ Implement real benchmark data scraping
- ✅ Add user authentication & history
- ✅ Create comparison mode (compare 2 models side-by-side)
- ✅ Add cost calculator feature
- ✅ Implement LLM API testing capability
- ✅ Add MongoDB for user data persistence

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**KMIT — Department of Computer Science and Engineering (AI&ML)**  
**IV B.Tech I Semester · A.Y 2025-26**

- **G. Rohith** (23BD5A6601)
- **K. Vignesh** (23BD5A6602)
- **K. SaiChandu** (23BD5A6604)
- **V. Manikanta** (23BD5A6606)

**Institution:** Keshav Memorial Institute of Technology (KMIT)  
**Branch:** CSE (AI&ML) - A Section  
**Project Stage:** Stage 1

---

## 🔗 Links

- **GitHub Repository:** [github.com/manivuppala124/LLMFinder](https://github.com/manivuppala124/LLMFinder)
- **Live Demo:** [Coming Soon]
- **API Documentation:** `http://localhost:8000/docs` (when running locally)

---

## 📧 Contact

For questions, suggestions, or collaboration opportunities:
- Open an [Issue](https://github.com/manivuppala124/LLMFinder/issues)
- Submit a [Pull Request](https://github.com/manivuppala124/LLMFinder/pulls)

---

## 🙏 Acknowledgments

- **OpenRouter** for comprehensive LLM pricing data
- **Artificial Analysis** for performance benchmarks
- **HuggingFace** for open LLM leaderboard
- **FastAPI** & **React** communities for excellent documentation

---

<div align="center">

**⭐ Star this repo if you find it useful! ⭐**

Made with ❤️ by KMIT CSE(AI&ML) Team

</div>
