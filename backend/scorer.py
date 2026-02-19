class WeightedScorer:
    PRIORITY_WEIGHTS = {
        "cost":         {"capability": 0.30, "cost": 0.45, "speed": 0.15, "context": 0.07, "deployment": 0.03},
        "speed":        {"capability": 0.30, "cost": 0.15, "speed": 0.45, "context": 0.07, "deployment": 0.03},
        "intelligence": {"capability": 0.55, "cost": 0.10, "speed": 0.15, "context": 0.15, "deployment": 0.05},
        "balanced":     {"capability": 0.35, "cost": 0.25, "speed": 0.20, "context": 0.15, "deployment": 0.05},
    }

    CONTEXT_MAP = {"4k": 4000, "32k": 32000, "128k": 128000, "200k": 200000}

    LATENCY_SCORES = {
        "realtime": {"realtime": 1.0, "moderate": 0.4, "batch": 0.1},
        "moderate":  {"realtime": 1.0, "moderate": 1.0, "batch": 0.3},
        "batch":     {"realtime": 1.0, "moderate": 1.0, "batch": 1.0},
    }

    DEPLOYMENT_SCORES = {
        "cloud": {"cloud": 1.0, "both": 1.0, "local": 0.0},
        "local": {"local": 1.0, "both": 1.0, "cloud": 0.0},
        "both":  {"both": 1.0, "cloud": 0.7, "local": 0.7},
    }

    def __init__(self, knowledge_base):
        self.kb = knowledge_base

    def compute_score(self, user_req: dict, llm: dict):
        task = user_req["task_type"]
        budget = float(user_req["budget"])
        latency = user_req["latency"]
        context_req = user_req["context_length"]
        deployment = user_req["deployment"]
        priority = user_req["priority"]

        # 1. Capability score
        capability = llm["task_scores"].get(task, 0.5)

        # 2. Cost score
        avg_cost = (llm["cost_input_per_1m"] + llm["cost_output_per_1m"]) / 2
        if avg_cost <= 0:
            cost_score = 1.0
        elif avg_cost <= budget:
            cost_score = 1.0
        else:
            cost_score = max(0.0, min(1.0, budget / avg_cost))

        # 3. Speed / Latency score
        speed_score = self.LATENCY_SCORES.get(latency, {}).get(llm["latency_class"], 0.5)

        # 4. Context score
        required_ctx = self.CONTEXT_MAP.get(context_req, 4000)
        llm_ctx = llm["context_window"]
        if llm_ctx >= required_ctx:
            context_score = 1.0
        else:
            context_score = max(0.3, llm_ctx / required_ctx)

        # 5. Deployment score
        deployment_score = self.DEPLOYMENT_SCORES.get(deployment, {}).get(llm["deployment"], 0.5)

        weights = self.PRIORITY_WEIGHTS.get(priority, self.PRIORITY_WEIGHTS["balanced"])

        raw_score = (
            weights["capability"] * capability
            + weights["cost"] * cost_score
            + weights["speed"] * speed_score
            + weights["context"] * context_score
            + weights["deployment"] * deployment_score
        )

        final_score = round(raw_score * 100, 1)

        # Format context window for display
        if llm_ctx >= 1_000_000:
            ctx_display = f"{llm_ctx // 1_000_000}M"
        elif llm_ctx >= 1_000:
            ctx_display = f"{llm_ctx // 1_000}k"
        else:
            ctx_display = str(llm_ctx)

        explanation = (
            f"{llm['name']} scores {final_score}/100. "
            f"It excels at {task} tasks (score: {capability:.2f}), "
            f"fits your ${budget:.0f} budget (${avg_cost:.2f} actual cost/1M tokens), "
            f"supports {ctx_display} context window, "
            f"available on {llm['deployment']} deployment."
        )

        return final_score, explanation
