import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Code2, MessageSquare, FileText, BarChart2, Languages, Database,
  DollarSign, Zap, Brain, Scale, ChevronRight, ChevronLeft,
  Cloud, HardDrive, Server, Loader2,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TASKS = [
  { id: "code", label: "Code Gen", desc: "Write & review code", icon: Code2 },
  { id: "chat", label: "Chat", desc: "Conversational AI", icon: MessageSquare },
  { id: "summarize", label: "Summarize", desc: "Condense documents", icon: FileText },
  { id: "analysis", label: "Analysis", desc: "Deep data analysis", icon: BarChart2 },
  { id: "translation", label: "Translation", desc: "Language conversion", icon: Languages },
  { id: "rag", label: "RAG", desc: "Retrieval augmented", icon: Database },
];

const LATENCY_OPTIONS = [
  { id: "realtime", label: "Realtime", desc: "< 1s response" },
  { id: "moderate", label: "Moderate", desc: "1–5s response" },
  { id: "batch", label: "Batch", desc: "Async / bulk" },
];

const CONTEXT_OPTIONS = [
  { value: "4k", label: "4k tokens", desc: "Short tasks" },
  { value: "32k", label: "32k tokens", desc: "Medium docs" },
  { value: "128k", label: "128k tokens", desc: "Long docs" },
  { value: "200k", label: "200k tokens", desc: "Very long / books" },
];

const DEPLOY_OPTIONS = [
  { id: "cloud", label: "Cloud", desc: "API-based", icon: Cloud },
  { id: "local", label: "Local", desc: "Self-hosted", icon: HardDrive },
  { id: "both", label: "Both", desc: "Any option", icon: Server },
];

const PRIORITIES = [
  { id: "cost", label: "Cost-First", desc: "Minimize spending", icon: DollarSign },
  { id: "speed", label: "Speed-First", desc: "Lowest latency", icon: Zap },
  { id: "intelligence", label: "Intelligence", desc: "Best capability", icon: Brain },
  { id: "balanced", label: "Balanced", desc: "All-around best", icon: Scale },
];

const STEPS = ["Use Case", "Configuration", "Preferences"];

export default function FormPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    task_type: "",
    budget: 5,
    latency: "moderate",
    context_length: "128k",
    deployment: "cloud",
    priority: "balanced",
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const canProceed = () => {
    if (step === 1) return !!form.task_type;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${API}/recommend`, form);
      navigate("/results", { state: { results: data, userReq: form } });
    } catch (e) {
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-16 px-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">

        {/* Progress Bar */}
        <div className="mb-10" data-testid="form-progress">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((label, i) => {
              const num = i + 1;
              const active = step === num;
              const done = step > num;
              return (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all
                      ${done ? "bg-[#7c6aff] border-[#7c6aff] text-[#07080f]" : ""}
                      ${active ? "border-[#7c6aff] text-[#7c6aff] bg-[#7c6aff]/10" : ""}
                      ${!active && !done ? "border-white/10 text-[#475569]" : ""}`}
                    data-testid={`step-indicator-${num}`}
                  >
                    {done ? "✓" : num}
                  </div>
                  <span className={`text-xs ${active ? "text-[#7c6aff]" : "text-[#475569]"}`}>{label}</span>
                </div>
              );
            })}
          </div>
          {/* Line */}
          <div className="h-0.5 bg-[#1e2035] rounded-full">
            <div
              className="h-full bg-[#7c6aff] rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div
          key={step}
          className="bg-[#0e101a] border border-white/5 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-300"
          data-testid={`form-step-${step}`}
        >
          {/* Step 1 — Task Type */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[#dde1f5] mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                What's your use case?
              </h2>
              <p className="text-sm text-[#94a3b8] mb-6">Select the primary task you'll use this LLM for.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TASKS.map(({ id, label, desc, icon: Icon }) => {
                  const selected = form.task_type === id;
                  return (
                    <button
                      key={id}
                      onClick={() => set("task_type", id)}
                      data-testid={`task-card-${id}`}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all
                        ${selected
                          ? "border-[#7c6aff] bg-[#7c6aff]/10 shadow-[0_0_15px_rgba(124,106,255,0.2)]"
                          : "border-white/5 bg-[#07080f] hover:border-[#7c6aff]/30 hover:bg-[#7c6aff]/5"
                        }`}
                    >
                      <Icon
                        size={22}
                        className={selected ? "text-[#7c6aff]" : "text-[#94a3b8]"}
                        strokeWidth={1.5}
                      />
                      <span className={`text-sm font-semibold ${selected ? "text-[#7c6aff]" : "text-[#dde1f5]"}`}>
                        {label}
                      </span>
                      <span className="text-xs text-[#475569]">{desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2 — Budget / Latency / Context */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#dde1f5] mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Configure your requirements
                </h2>
                <p className="text-sm text-[#94a3b8]">Set technical and budget constraints.</p>
              </div>

              {/* Budget */}
              <div data-testid="budget-section">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-[#dde1f5]">Budget per 1M tokens</label>
                  <span
                    className="mono text-[#7c6aff] font-bold text-lg"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                    data-testid="budget-display"
                  >
                    ${Number(form.budget).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={form.budget}
                  onChange={(e) => set("budget", parseFloat(e.target.value))}
                  className="w-full"
                  data-testid="budget-slider"
                />
                <div className="flex justify-between text-xs text-[#475569] mt-1">
                  <span>$0.10</span>
                  <span>$100</span>
                </div>
              </div>

              {/* Latency */}
              <div data-testid="latency-section">
                <label className="text-sm font-medium text-[#dde1f5] block mb-3">Latency requirement</label>
                <div className="flex gap-3">
                  {LATENCY_OPTIONS.map(({ id, label, desc }) => {
                    const selected = form.latency === id;
                    return (
                      <button
                        key={id}
                        onClick={() => set("latency", id)}
                        data-testid={`latency-${id}`}
                        className={`flex-1 py-3 px-4 rounded-xl border text-center transition-all
                          ${selected
                            ? "border-[#7c6aff] bg-[#7c6aff]/10 text-[#7c6aff]"
                            : "border-white/5 bg-[#07080f] text-[#94a3b8] hover:border-[#7c6aff]/30"
                          }`}
                      >
                        <div className="text-sm font-semibold">{label}</div>
                        <div className="text-xs text-[#475569] mt-0.5">{desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Context */}
              <div data-testid="context-section">
                <label className="text-sm font-medium text-[#dde1f5] block mb-3">Context window needed</label>
                <div className="grid grid-cols-2 gap-3">
                  {CONTEXT_OPTIONS.map(({ value, label, desc }) => {
                    const selected = form.context_length === value;
                    return (
                      <button
                        key={value}
                        onClick={() => set("context_length", value)}
                        data-testid={`context-${value}`}
                        className={`py-3 px-4 rounded-xl border text-left transition-all
                          ${selected
                            ? "border-[#7c6aff] bg-[#7c6aff]/10"
                            : "border-white/5 bg-[#07080f] hover:border-[#7c6aff]/30"
                          }`}
                      >
                        <div className={`text-sm font-bold mono ${selected ? "text-[#7c6aff]" : "text-[#dde1f5]"}`}
                          style={{ fontFamily: "JetBrains Mono, monospace" }}>
                          {label}
                        </div>
                        <div className="text-xs text-[#475569] mt-0.5">{desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Deployment / Priority */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#dde1f5] mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Final preferences
                </h2>
                <p className="text-sm text-[#94a3b8]">Where will you run it, and what matters most?</p>
              </div>

              {/* Deployment */}
              <div data-testid="deployment-section">
                <label className="text-sm font-medium text-[#dde1f5] block mb-3">Deployment preference</label>
                <div className="flex gap-3">
                  {DEPLOY_OPTIONS.map(({ id, label, desc, icon: Icon }) => {
                    const selected = form.deployment === id;
                    return (
                      <button
                        key={id}
                        onClick={() => set("deployment", id)}
                        data-testid={`deploy-${id}`}
                        className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border text-center transition-all
                          ${selected
                            ? "border-[#00e5b0] bg-[#00e5b0]/10 text-[#00e5b0]"
                            : "border-white/5 bg-[#07080f] text-[#94a3b8] hover:border-[#00e5b0]/30"
                          }`}
                      >
                        <Icon size={20} strokeWidth={1.5} />
                        <div className="text-sm font-semibold">{label}</div>
                        <div className="text-xs text-[#475569]">{desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority */}
              <div data-testid="priority-section">
                <label className="text-sm font-medium text-[#dde1f5] block mb-3">Optimization priority</label>
                <div className="grid grid-cols-2 gap-3">
                  {PRIORITIES.map(({ id, label, desc, icon: Icon }) => {
                    const selected = form.priority === id;
                    return (
                      <button
                        key={id}
                        onClick={() => set("priority", id)}
                        data-testid={`priority-${id}`}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all
                          ${selected
                            ? "border-[#7c6aff] bg-[#7c6aff]/10"
                            : "border-white/5 bg-[#07080f] hover:border-[#7c6aff]/30"
                          }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                          ${selected ? "bg-[#7c6aff] text-[#07080f]" : "bg-[#1e2035] text-[#94a3b8]"}`}>
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${selected ? "text-[#7c6aff]" : "text-[#dde1f5]"}`}>
                            {label}
                          </div>
                          <div className="text-xs text-[#475569]">{desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-400 text-center" data-testid="form-error">{error}</p>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            data-testid="form-back-btn"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10
                       text-[#94a3b8] text-sm hover:text-[#dde1f5] hover:border-white/20
                       transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              data-testid="form-next-btn"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7c6aff]
                         text-[#07080f] font-bold text-sm hover:bg-[#6b5acd]
                         transition-all hover:scale-105 active:scale-95
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              data-testid="form-submit-btn"
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#7c6aff]
                         text-[#07080f] font-bold text-sm hover:bg-[#6b5acd]
                         transition-all hover:scale-105 active:scale-95
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                         shadow-[0_0_20px_rgba(124,106,255,0.4)]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Find My LLM
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
