"""Backend tests for LLMMatch API - health, models, recommend endpoints"""
import pytest
import requests
import os

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")

SAMPLE_REQ = {
    "task_type": "code",
    "budget": 10.0,
    "latency": "realtime",
    "context_length": "medium",
    "deployment": "api",
    "priority": "cost",
}


class TestHealth:
    def test_health_returns_ok(self):
        r = requests.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"


class TestModels:
    def test_get_models_returns_list(self):
        r = requests.get(f"{BASE_URL}/api/models")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)

    def test_get_models_returns_20(self):
        r = requests.get(f"{BASE_URL}/api/models")
        assert r.status_code == 200
        assert len(r.json()) == 20

    def test_model_has_required_fields(self):
        r = requests.get(f"{BASE_URL}/api/models")
        model = r.json()[0]
        for field in ["name", "provider", "tags", "cost_input_per_1m", "cost_output_per_1m", "context_window", "latency_class", "deployment"]:
            assert field in model, f"Missing field: {field}"


class TestRecommend:
    def test_recommend_returns_200(self):
        r = requests.post(f"{BASE_URL}/api/recommend", json=SAMPLE_REQ)
        assert r.status_code == 200

    def test_recommend_has_top_pick(self):
        r = requests.post(f"{BASE_URL}/api/recommend", json=SAMPLE_REQ)
        data = r.json()
        assert "top_pick" in data
        assert data["top_pick"]["name"]
        assert 0 <= data["top_pick"]["score"] <= 100

    def test_recommend_has_alternatives(self):
        r = requests.post(f"{BASE_URL}/api/recommend", json=SAMPLE_REQ)
        data = r.json()
        assert "alternatives" in data
        assert len(data["alternatives"]) == 2

    def test_recommend_has_ml_prediction(self):
        r = requests.post(f"{BASE_URL}/api/recommend", json=SAMPLE_REQ)
        data = r.json()
        assert "ml_prediction" in data

    def test_recommend_top_pick_fields(self):
        r = requests.post(f"{BASE_URL}/api/recommend", json=SAMPLE_REQ)
        tp = r.json()["top_pick"]
        for field in ["name", "provider", "score", "explanation", "link", "tags"]:
            assert field in tp, f"Missing: {field}"

    def test_recommend_all_task_types(self):
        for task in ["code", "chat", "summarize", "analysis", "translation", "rag"]:
            req = {**SAMPLE_REQ, "task_type": task}
            r = requests.post(f"{BASE_URL}/api/recommend", json=req)
            assert r.status_code == 200, f"Failed for task: {task}"

    def test_recommend_missing_field_returns_error(self):
        r = requests.post(f"{BASE_URL}/api/recommend", json={"task_type": "code"})
        assert r.status_code == 422
