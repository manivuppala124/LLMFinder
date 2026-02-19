import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ExternalLink, RotateCcw, Trophy, Zap, DollarSign, Brain,
  ChevronRight, CheckCircle, Cpu,
} from "lucide-react";

const fmtCtx = (n) => {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return n;
};

const fmtCost = (n) => (n < 0.01 ? n.toFixed(3) : n.toFixed(2));

const latencyColor = {
  realtime: "text-[#00e5b0] bg-[#00e5b0]/10 border-[#00e5b0]/20",
  moderate: "text-[#7c6aff] bg-[#7c6aff]/10 border-[#7c6aff]/20",
  batch: "text-[#94a3b8] bg-white/5 border-white/10",
};

const scoreGradient = (score) => {
  if (score >= 80) return "from-[#00e5b0] to-[#7c6aff]";
  if (score >= 60) return "from-[#7c6aff] to-[#5b4aef]";
  return "from-[#475569] to-[#334155]";
};

function ScoreBar({ score, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 200 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div className="h-2 bg-[#1e2035] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${scoreGradient(score)} score-bar`}
        style={{ width: `${width}%` }}
        data-testid="score-bar"
      />
    </div>
  );
}

function TagBadge({ tag, index }) {
  const teal = index % 2 === 0;
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full border font-medium
        ${teal
          ? "text-[#00e5b0] bg-[#00e5b0]/10 border-[#00e5b0]/20"
          : "text-[#7c6aff] bg-[#7c6aff]/10 border-[#7c6aff]/20"
        }`}
    >
      {tag}
    </span>
  );
}

function HeroCard({ model, userReq }) {
  return (
    <div
      className="relative rounded-2xl border border-[#7c6aff] p-8 mb-6 overflow-hidden
                 shadow-[0_0_40px_rgba(124,106,255,0.15)]"
      style={{ background: "linear-gradient(135deg, #131427 0%, #0e101a 100%)" }}
      data-testid="top-pick-card"
    >
      {/* Glow bg */}
      <div
        className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7c6aff 0%, transparent 70%)" }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#7c6aff]/20 border border-[#7c6aff]/30 flex items-center justify-center">
            <Trophy size={22} className="text-[#7c6aff]" strokeWidth={1.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#7c6aff] bg-[#7c6aff]/10 px-2 py-0.5 rounded-full border border-[#7c6aff]/20">
                #1 Pick
              </span>
              {model.is_ml_pick && (
                <span className="text-xs font-medium text-[#00e5b0] bg-[#00e5b0]/10 px-2 py-0.5 rounded-full border border-[#00e5b0]/20"
                  data-testid="ml-pick-badge">
                  ML Confirmed
                </span>
              )}
            </div>
            <h2
              className="text-2xl font-bold text-[#dde1f5] mt-1"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
              data-testid="top-pick-name"
            >
              {model.name}
            </h2>
            <p className="text-sm text-[#94a3b8]">{model.provider}</p>
          </div>
        </div>

        {/* Score */}
        <div className="text-right">
          <div
            className="text-4xl font-bold text-[#7c6aff] mono"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
            data-testid="top-pick-score"
          >
            {model.score}
          </div>
          <div className="text-xs text-[#94a3b8]">/ 100</div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <ScoreBar score={model.score} delay={0} />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2035] border border-white/5">
          <DollarSign size={14} className="text-[#00e5b0]" />
          <span className="text-xs text-[#dde1f5] mono" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            ${fmtCost(model.cost_input)}/${ fmtCost(model.cost_output)} /1M
          </span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${latencyColor[model.latency_class] || latencyColor.batch}`}>
          <Zap size={14} strokeWidth={1.5} />
          <span className="capitalize">{model.latency_class}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2035] border border-white/5">
          <Brain size={14} className="text-[#7c6aff]" />
          <span className="text-xs text-[#dde1f5]">{fmtCtx(model.context_window)} ctx</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2035] border border-white/5">
          <Cpu size={14} className="text-[#94a3b8]" />
          <span className="text-xs text-[#dde1f5] capitalize">{model.deployment}</span>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-sm text-[#94a3b8] leading-relaxed mb-6 border-l-2 border-[#7c6aff]/40 pl-4"
        data-testid="top-pick-explanation">
        {model.explanation}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {model.tags.map((tag, i) => <TagBadge key={tag} tag={tag} index={i} />)}
      </div>

      {/* CTA */}
      <a
        href={model.link}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="visit-model-link"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7c6aff]
                   text-[#07080f] font-bold text-sm hover:bg-[#6b5acd]
                   transition-all hover:scale-105 active:scale-95"
      >
        Visit {model.provider} <ExternalLink size={14} />
      </a>
    </div>
  );
}

function AltCard({ model, rank }) {
  return (
    <div
      className="bg-[#0e101a] border border-white/5 rounded-xl p-6 card-hover"
      data-testid={`alt-card-${rank}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-medium text-[#94a3b8]">#{rank} Alternative</span>
          <h3
            className="text-lg font-bold text-[#dde1f5] mt-0.5"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
            data-testid={`alt-name-${rank}`}
          >
            {model.name}
          </h3>
          <p className="text-xs text-[#475569]">{model.provider}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#dde1f5] mono" style={{ fontFamily: "JetBrains Mono, monospace" }}
            data-testid={`alt-score-${rank}`}>
            {model.score}
          </div>
          <div className="text-xs text-[#475569]">/ 100</div>
        </div>
      </div>

      <div className="mb-4">
        <ScoreBar score={model.score} delay={rank * 100} />
      </div>

      <p className="text-xs text-[#94a3b8] leading-relaxed mb-4" data-testid={`alt-explanation-${rank}`}>
        {model.explanation}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#07080f] border border-white/5">
          <DollarSign size={11} className="text-[#00e5b0]" />
          <span className="text-xs text-[#dde1f5] mono" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            ${fmtCost(model.cost_input)}/1M
          </span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs ${latencyColor[model.latency_class] || latencyColor.batch}`}>
          <Zap size={11} strokeWidth={1.5} />
          <span className="capitalize">{model.latency_class}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#07080f] border border-white/5">
          <span className="text-xs text-[#94a3b8]">{fmtCtx(model.context_window)} ctx</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {model.tags.slice(0, 2).map((tag, i) => <TagBadge key={tag} tag={tag} index={i} />)}
      </div>

      <a
        href={model.link}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={`alt-visit-link-${rank}`}
        className="inline-flex items-center gap-1.5 text-xs text-[#7c6aff] hover:text-[#9b8fff]
                   transition-colors font-medium"
      >
        View docs <ExternalLink size={12} />
      </a>
    </div>
  );
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  useEffect(() => {
    if (!data?.results) navigate("/form");
  }, [data, navigate]);

  if (!data?.results) return null;

  const { results, userReq } = data;
  const { top_pick, alternatives, ml_prediction } = results;

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00e5b0]/30 bg-[#00e5b0]/10 mb-4">
            <CheckCircle size={14} className="text-[#00e5b0]" />
            <span className="text-xs font-medium text-[#00e5b0]">Analysis Complete</span>
          </div>
          <h1
            className="text-3xl font-bold text-[#dde1f5] mb-2"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
            data-testid="results-heading"
          >
            Your LLM Recommendations
          </h1>
          <p className="text-sm text-[#94a3b8]">
            Based on your{" "}
            <span className="text-[#7c6aff] font-medium capitalize">{userReq.task_type}</span> use case ·{" "}
            <span className="text-[#7c6aff] font-medium">${userReq.budget}</span>/1M budget ·{" "}
            <span className="text-[#7c6aff] font-medium capitalize">{userReq.priority}</span> priority
          </p>
          {ml_prediction && (
            <p className="text-xs text-[#475569] mt-1">
              ML model agrees: <span className="text-[#00e5b0]">{ml_prediction}</span>
            </p>
          )}
        </div>

        {/* Top pick */}
        <div className="fade-up-2">
          <HeroCard model={top_pick} userReq={userReq} />
        </div>

        {/* Alternatives */}
        {alternatives.length > 0 && (
          <div>
            <h3
              className="text-lg font-semibold text-[#94a3b8] mb-4 flex items-center gap-2"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <ChevronRight size={16} className="text-[#475569]" />
              Alternatives worth considering
            </h3>
            <div className="grid md:grid-cols-2 gap-4 fade-up-3">
              {alternatives.map((model, i) => (
                <AltCard key={model.name} model={model} rank={i + 2} />
              ))}
            </div>
          </div>
        )}

        {/* Try Again */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/form")}
            data-testid="try-again-btn"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10
                       text-[#94a3b8] text-sm hover:text-[#dde1f5] hover:border-white/20
                       transition-all hover:scale-105"
          >
            <RotateCcw size={16} />
            Try Different Requirements
          </button>
        </div>
      </div>
    </main>
  );
}
