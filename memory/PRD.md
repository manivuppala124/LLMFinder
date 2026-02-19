# LLMMatch — PRD

## Overview
An Intelligent LLM Recommendation System that helps developers find the right LLM for their use case in seconds. Users fill a 3-step form and get a scored, explainable recommendation from a knowledge base of 20 LLMs.

## Architecture
- **Backend**: FastAPI (Python) — `/app/backend/server.py`
- **Scoring Engine**: `scorer.py` — WeightedScorer class with priority-aware weights
- **ML Engine**: `ml_model.py` — RandomForestClassifier trained on 2000 synthetic samples
- **Knowledge Base**: `knowledge_base.json` — 20 LLMs with cost/latency/capability data
- **Frontend**: React.js with Tailwind CSS — 4 pages

## User Personas
- **Developers** choosing LLMs for production apps
- **AI Engineers** comparing models for specific tasks
- **Technical Decision Makers** optimizing cost vs capability

## Implemented Features (Feb 2026)

### Backend
- `POST /api/recommend` — Takes 6 user inputs, returns top 3 scored LLMs with explanations
- `GET /api/models` — Returns full 20-model knowledge base
- `GET /api/health` — Health check
- WeightedScorer with 4 priority modes: cost, speed, intelligence, balanced
- RandomForestClassifier ML predictor (trains on startup, 2000 synthetic samples)
- 5-dimension scoring: capability, cost, latency, context window, deployment match

### Frontend
- **HomePage** — Dark hero, animated stats, "Find Your Perfect LLM" CTA
- **FormPage** — 3-step wizard: task type (6 icon cards) → budget/latency/context → deployment/priority
- **ResultPage** — Hero card (top pick) + 2 alternative cards, animated score bars, full explanation
- **ModelsPage** — Searchable + filterable table of all 20 LLMs

### Design
- Color: #07080f background, #0e101a cards, #7c6aff purple, #00e5b0 teal
- Font: Space Grotesk (headings), Inter (body), JetBrains Mono (data)
- Micro-animations: score bars animate 0→value, fade-up entrance animations

## Knowledge Base (20 LLMs)
GPT-4o, GPT-4o-mini, GPT-3.5-turbo, Claude 3.5 Sonnet, Claude 3 Haiku, Claude 3 Opus,
Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 2.0 Flash, Llama 3.1 70B, Llama 3.1 8B,
Mistral 7B, Mixtral 8x7B, Mistral Large, DeepSeek V2, DeepSeek Coder V2,
Qwen 2.5 72B, Command R+, Phi-3 Mini, Groq Llama 3

## Test Results
- Backend: 100% (11/11 tests)
- Frontend: 100% (all flows)
- API tested: health, models, recommend (all 6 task types)

## Backlog / Next Steps
### P0 (Critical)
- None — MVP complete

### P1 (High Value)
- Model comparison view (select 2 models side by side)
- LLM benchmark charts (MMLU, HumanEval scores)
- Share results link (encode params in URL)

### P2 (Nice to Have)
- User-defined custom weights for scoring
- Export recommendations as PDF/Markdown
- Model update notifications (new models, price changes)
- Cost calculator (tokens × cost per session)
