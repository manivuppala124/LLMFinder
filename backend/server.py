import json
import logging
import threading
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pydantic import BaseModel
from typing import List, Optional

from scorer import WeightedScorer
from ml_model import MLRecommender

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection (kept for environment compatibility)
client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

# Load knowledge base
with open(ROOT_DIR / "knowledge_base.json", "r") as f:
    KNOWLEDGE_BASE = json.load(f)

scorer = WeightedScorer(KNOWLEDGE_BASE)
recommender = MLRecommender(KNOWLEDGE_BASE)

app = FastAPI(title="LLMMatch API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


# ── Models ────────────────────────────────────────────────────────────────────

class UserRequirements(BaseModel):
    task_type: str
    budget: float
    latency: str
    context_length: str
    deployment: str
    priority: str


class ModelScore(BaseModel):
    name: str
    provider: str
    score: float
    explanation: str
    cost_input: float
    cost_output: float
    context_window: int
    latency_class: str
    deployment: str
    tags: List[str]
    link: str
    task_score: float
    is_ml_pick: bool = False


class RecommendResponse(BaseModel):
    top_pick: ModelScore
    alternatives: List[ModelScore]
    ml_prediction: Optional[str] = None


# ── Routes ────────────────────────────────────────────────────────────────────

@api_router.get("/health")
async def health():
    return {"status": "ok"}


@api_router.get("/models")
async def get_models():
    return KNOWLEDGE_BASE


@api_router.post("/recommend", response_model=RecommendResponse)
async def recommend(req: UserRequirements):
    req_dict = req.model_dump()

    # Score all models
    scored = []
    for llm in KNOWLEDGE_BASE:
        score, explanation = scorer.compute_score(req_dict, llm)
        scored.append({
            **llm,
            "score": score,
            "explanation": explanation,
            "task_score": llm["task_scores"].get(req.task_type, 0),
            "is_ml_pick": False,
        })

    scored.sort(key=lambda x: x["score"], reverse=True)
    top3 = scored[:3]

    # ML prediction
    ml_prediction = None
    try:
        ml_prediction = recommender.predict(req_dict)
        for m in top3:
            if m["name"] == ml_prediction:
                m["is_ml_pick"] = True
    except Exception as e:
        logger.warning(f"ML prediction skipped: {e}")

    def to_model_score(m: dict) -> ModelScore:
        return ModelScore(
            name=m["name"],
            provider=m["provider"],
            score=round(m["score"], 1),
            explanation=m["explanation"],
            cost_input=m["cost_input_per_1m"],
            cost_output=m["cost_output_per_1m"],
            context_window=m["context_window"],
            latency_class=m["latency_class"],
            deployment=m["deployment"],
            tags=m["tags"],
            link=m["link"],
            task_score=round(m["task_score"], 2),
            is_ml_pick=m.get("is_ml_pick", False),
        )

    return RecommendResponse(
        top_pick=to_model_score(top3[0]),
        alternatives=[to_model_score(m) for m in top3[1:3]],
        ml_prediction=ml_prediction,
    )


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    def train():
        try:
            recommender.train()
            logger.info("ML model trained successfully")
        except Exception as e:
            logger.warning(f"ML model training failed: {e}")

    t = threading.Thread(target=train, daemon=True)
    t.start()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
