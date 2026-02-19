import { useState, useEffect } from "react";
import axios from "axios";
import { Search, ExternalLink, Loader2, Filter } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmtCtx = (n) => {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return n;
};

const fmtCost = (n) => (n < 0.01 ? n.toFixed(3) : n.toFixed(2));

const TASKS = ["all", "code", "chat", "summarize", "analysis", "translation", "rag"];

const latencyBadge = {
  realtime: "text-[#00e5b0] bg-[#00e5b0]/10 border-[#00e5b0]/20",
  moderate: "text-[#7c6aff] bg-[#7c6aff]/10 border-[#7c6aff]/20",
  batch: "text-[#94a3b8] bg-white/5 border-white/10",
};

const getBestFor = (model) => {
  const scores = model.task_scores;
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
};

export default function ModelsPage() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${API}/models`)
      .then((r) => setModels(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = models.filter((m) => {
    const matchTask = task === "all" || getBestFor(m) === task;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.provider.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchTask && matchSearch;
  });

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 fade-up">
          <h1
            className="text-4xl font-bold text-[#dde1f5] mb-2"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
            data-testid="models-heading"
          >
            All LLM Models
          </h1>
          <p className="text-[#94a3b8] text-sm">
            {models.length} models indexed · Filtered: {filtered.length} results
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 fade-up-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
            <input
              type="text"
              placeholder="Search models, providers, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="models-search"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0e101a] border border-white/5
                         text-sm text-[#dde1f5] placeholder-[#475569] outline-none
                         focus:border-[#7c6aff]/40 transition-colors"
            />
          </div>

          {/* Task filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-[#475569]" />
            {TASKS.map((t) => (
              <button
                key={t}
                onClick={() => setTask(t)}
                data-testid={`filter-${t}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all
                  ${task === t
                    ? "bg-[#7c6aff] text-[#07080f]"
                    : "bg-[#0e101a] border border-white/5 text-[#94a3b8] hover:border-[#7c6aff]/30"
                  }`}
              >
                {t === "all" ? "All Tasks" : t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-[#94a3b8]">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Loading models...</span>
          </div>
        ) : (
          <div className="bg-[#0e101a] border border-white/5 rounded-2xl overflow-hidden fade-up-3"
            data-testid="models-table">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1.2fr_1.5fr_auto] gap-4 px-6 py-3
                            border-b border-white/5 text-xs font-medium text-[#475569] uppercase tracking-wider">
              <span>Model</span>
              <span>Provider</span>
              <span>Input/1M</span>
              <span>Output/1M</span>
              <span>Context</span>
              <span>Latency</span>
              <span>Best For · Tags</span>
              <span></span>
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-[#475569]">No models match your filters.</div>
            ) : (
              filtered.map((model, i) => {
                const bestFor = getBestFor(model);
                const taskScore = model.task_scores[bestFor];
                return (
                  <div
                    key={model.name}
                    className={`grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1.2fr_1.5fr_auto] gap-4 px-6 py-4 items-center
                                transition-colors hover:bg-white/[0.02]
                                ${i < filtered.length - 1 ? "border-b border-white/[0.04]" : ""}`}
                    data-testid={`model-row-${model.name.toLowerCase().replace(/ /g, "-")}`}
                  >
                    {/* Name */}
                    <div>
                      <div className="text-sm font-semibold text-[#dde1f5]">{model.name}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {model.tags.slice(0, 1).map((tag) => (
                          <span key={tag} className="text-xs text-[#475569]">#{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Provider */}
                    <div className="text-sm text-[#94a3b8]">{model.provider}</div>

                    {/* Input cost */}
                    <div
                      className="text-sm font-medium text-[#00e5b0] mono"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      ${fmtCost(model.cost_input_per_1m)}
                    </div>

                    {/* Output cost */}
                    <div
                      className="text-sm font-medium text-[#94a3b8] mono"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      ${fmtCost(model.cost_output_per_1m)}
                    </div>

                    {/* Context */}
                    <div className="text-sm text-[#dde1f5] mono" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                      {fmtCtx(model.context_window)}
                    </div>

                    {/* Latency */}
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize
                        ${latencyBadge[model.latency_class] || latencyBadge.batch}`}>
                        {model.latency_class}
                      </span>
                    </div>

                    {/* Best For + score */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs capitalize text-[#dde1f5] font-medium">{bestFor}</span>
                        <span className="text-xs text-[#00e5b0] mono" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                          {(taskScore * 100).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {model.tags.slice(1, 3).map((tag, ti) => (
                          <span key={tag}
                            className={`text-xs px-1.5 py-0.5 rounded border
                              ${ti % 2 === 0
                                ? "text-[#7c6aff] bg-[#7c6aff]/10 border-[#7c6aff]/20"
                                : "text-[#00e5b0] bg-[#00e5b0]/10 border-[#00e5b0]/20"}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Link */}
                    <div>
                      <a
                        href={model.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`model-link-${model.name.toLowerCase().replace(/ /g, "-")}`}
                        className="text-[#475569] hover:text-[#7c6aff] transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </main>
  );
}
