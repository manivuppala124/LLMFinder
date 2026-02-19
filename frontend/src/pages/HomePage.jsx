import { Link } from "react-router-dom";
import { ArrowRight, Zap, Brain, DollarSign, Database, Star } from "lucide-react";

const stats = [
  { value: "20+", label: "LLM Models", icon: Brain },
  { value: "6", label: "Task Types", icon: Zap },
  { value: "<1s", label: "Instant Results", icon: Star },
  { value: "100%", label: "Explainable", icon: Database },
];

const features = [
  {
    icon: Brain,
    title: "Intelligent Scoring",
    desc: "Weighted algorithm adjusts priorities based on your requirements — cost, speed, or capability.",
  },
  {
    icon: DollarSign,
    title: "Budget-Aware",
    desc: "Set your token budget and we'll surface models that fit — no surprises on your cloud bill.",
  },
  {
    icon: Zap,
    title: "Real Explainability",
    desc: "Not just 'here's GPT-4'. We tell you exactly why each model scored what it did.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #7c6aff 0%, transparent 70%)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="fade-up-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7c6aff]/30 bg-[#7c6aff]/10 mb-6">
            <span className="pulse-dot w-2 h-2 rounded-full bg-[#00e5b0]" />
            <span className="text-xs font-medium text-[#7c6aff]">Intelligent LLM Recommendation</span>
          </div>

          <h1
            className="fade-up-2 text-5xl sm:text-6xl lg:text-7xl font-bold text-[#dde1f5] mb-6"
            style={{ fontFamily: "Space Grotesk, sans-serif", letterSpacing: "-0.03em" }}
            data-testid="hero-heading"
          >
            Find Your{" "}
            <span className="text-[#7c6aff]">Perfect</span> LLM
          </h1>

          <p className="fade-up-3 text-lg text-[#94a3b8] max-w-xl mx-auto mb-10 leading-relaxed">
            Stop wasting hours across scattered benchmarks and pricing pages.
            Get a ranked, explainable recommendation in seconds — tailored to your exact use case.
          </p>

          <div className="fade-up-4 flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/form"
              data-testid="hero-get-started-btn"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#7c6aff]
                         text-[#07080f] font-bold text-base hover:bg-[#6b5acd]
                         transition-all hover:scale-105 active:scale-95
                         shadow-[0_0_25px_rgba(124,106,255,0.4)]"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/models"
              data-testid="hero-browse-models-btn"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10
                         text-[#dde1f5] font-medium text-base hover:border-[#7c6aff]/40
                         hover:bg-[#7c6aff]/5 transition-all"
            >
              Browse All Models
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, label, icon: Icon }, i) => (
            <div
              key={label}
              className={`fade-up-${i + 1} bg-[#0e101a] border border-white/5 rounded-xl p-6
                          text-center card-hover`}
              data-testid={`stat-${label.toLowerCase().replace(/ /g, "-")}`}
            >
              <Icon size={22} className="text-[#7c6aff] mx-auto mb-3" strokeWidth={1.5} />
              <div
                className="text-3xl font-bold text-[#dde1f5] mb-1 mono"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {value}
              </div>
              <div className="text-sm text-[#94a3b8]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <h2
          className="text-2xl font-bold text-[#dde1f5] text-center mb-10"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Why LLMMatch?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#0e101a] border border-white/5 rounded-xl p-6 card-hover"
              data-testid={`feature-${title.toLowerCase().replace(/ /g, "-")}`}
            >
              <div className="w-10 h-10 rounded-lg bg-[#7c6aff]/10 border border-[#7c6aff]/20 flex items-center justify-center mb-4">
                <Icon size={20} className="text-[#7c6aff]" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-[#dde1f5] mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                {title}
              </h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 pb-24">
        <div
          className="max-w-3xl mx-auto rounded-2xl border border-[#7c6aff]/20 p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0e101a 0%, #12101f 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, #7c6aff 0%, transparent 60%)" }}
          />
          <h2
            className="relative text-3xl font-bold text-[#dde1f5] mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Ready to find your perfect LLM?
          </h2>
          <p className="relative text-[#94a3b8] mb-8">
            Answer 6 quick questions and get a ranked recommendation with full explanations.
          </p>
          <Link
            to="/form"
            data-testid="cta-get-recommendation-btn"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#7c6aff]
                       text-[#07080f] font-bold hover:bg-[#6b5acd] transition-all
                       hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(124,106,255,0.4)]"
          >
            Get My Recommendation
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
