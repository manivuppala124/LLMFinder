import { Link, useLocation } from "react-router-dom";
import { Cpu, LayoutGrid } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      pathname === path
        ? "text-[#7c6aff]"
        : "text-[#94a3b8] hover:text-[#dde1f5]"
    }`;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4
                 bg-[#07080f]/80 backdrop-blur-xl border-b border-white/5"
      data-testid="navbar"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
        <div className="w-7 h-7 rounded-lg bg-[#7c6aff] flex items-center justify-center">
          <Cpu size={14} color="#07080f" strokeWidth={2.5} />
        </div>
        <span
          className="font-bold text-[#dde1f5]"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          LLM<span className="text-[#7c6aff]">Match</span>
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-6">
        <Link to="/" className={linkClass("/")} data-testid="nav-home">
          Home
        </Link>
        <Link to="/models" className={linkClass("/models")} data-testid="nav-models">
          <span className="flex items-center gap-1">
            <LayoutGrid size={14} />
            Models
          </span>
        </Link>
        <Link
          to="/form"
          data-testid="nav-get-recommendation"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7c6aff]
                     text-[#07080f] text-sm font-bold hover:bg-[#6b5acd]
                     transition-all hover:scale-105 active:scale-95
                     shadow-[0_0_15px_rgba(124,106,255,0.35)]"
        >
          Get Recommendation
        </Link>
      </div>
    </nav>
  );
}
