import threading
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "trained_model.pkl"


class MLRecommender:
    TASK_TYPES = ["code", "chat", "summarize", "analysis", "translation", "rag"]
    LATENCY_CLASSES = ["realtime", "moderate", "batch"]
    DEPLOYMENTS = ["cloud", "local", "both"]
    PRIORITIES = ["cost", "speed", "intelligence", "balanced"]
    CONTEXT_LENGTHS = ["4k", "32k", "128k", "200k"]
    CONTEXT_MAP = {"4k": 4000, "32k": 32000, "128k": 128000, "200k": 200000}

    def __init__(self, knowledge_base):
        self.kb = knowledge_base
        self.model = None
        self._lock = threading.Lock()

    def _encode(self, row: dict) -> list:
        task_enc = self.TASK_TYPES.index(row["task_type"]) if row["task_type"] in self.TASK_TYPES else 0
        latency_enc = self.LATENCY_CLASSES.index(row["latency"]) if row["latency"] in self.LATENCY_CLASSES else 0
        deploy_enc = self.DEPLOYMENTS.index(row["deployment"]) if row["deployment"] in self.DEPLOYMENTS else 0
        priority_enc = self.PRIORITIES.index(row["priority"]) if row["priority"] in self.PRIORITIES else 3
        context_enc = self.CONTEXT_MAP.get(row["context_length"], 4000)
        budget = float(row["budget"])
        return [task_enc, budget, latency_enc, context_enc, deploy_enc, priority_enc]

    def generate_synthetic_data(self, n: int = 2000):
        from scorer import WeightedScorer
        scorer = WeightedScorer(self.kb)
        rng = np.random.default_rng(42)
        rows, labels = [], []

        for _ in range(n):
            req = {
                "task_type": rng.choice(self.TASK_TYPES),
                "budget": float(rng.uniform(0.1, 100)),
                "latency": rng.choice(self.LATENCY_CLASSES),
                "context_length": rng.choice(self.CONTEXT_LENGTHS),
                "deployment": rng.choice(self.DEPLOYMENTS),
                "priority": rng.choice(self.PRIORITIES),
            }
            best_score, best_model = -1, None
            for llm in self.kb:
                score, _ = scorer.compute_score(req, llm)
                if score > best_score:
                    best_score, best_model = score, llm["name"]
            rows.append(self._encode(req))
            labels.append(best_model)

        return rows, labels

    def train(self):
        import joblib
        from sklearn.ensemble import RandomForestClassifier

        X, y = self.generate_synthetic_data(n=2000)
        clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
        clf.fit(X, y)
        joblib.dump(clf, MODEL_PATH)
        with self._lock:
            self.model = clf

    def predict(self, user_req: dict) -> str:
        import joblib
        with self._lock:
            model = self.model
        if model is None:
            if MODEL_PATH.exists():
                loaded = joblib.load(MODEL_PATH)
                with self._lock:
                    self.model = loaded
                    model = loaded
            else:
                raise ValueError("Model not trained yet")
        return model.predict([self._encode(user_req)])[0]
