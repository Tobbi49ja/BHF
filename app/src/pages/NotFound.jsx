// src/pages/NotFound.jsx
import { useState, useEffect } from "react";
import Icon from "../components/Icon";

export default function NotFound({ onBack }) {
  const [phase, setPhase] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const timers = [100, 300, 500, 700].map((d, i) =>
      setTimeout(() => setPhase(i + 1), d)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Random glitch effect on the 404
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const vis = (p) => ({
    opacity: phase >= p ? 1 : 0,
    transform: phase >= p ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.5s ease, transform 0.5s ease`,
  });

  return (
    <div className="notfound-page">
      {/* Background */}
      <div className="notfound-grid" />
      <div className="notfound-glow" />
      <div className="notfound-glow notfound-glow-2" />

      <div className="notfound-content">
        {/* Logo */}
        <div className="notfound-logo" style={vis(1)}>
          <div className="landing-logo-icon">
            <Icon name="shield-plus" size={18} />
          </div>
          <div className="landing-logo-text">
            <span className="landing-logo-main">BHF</span>
            <span className="landing-logo-sub">DataGuardian</span>
          </div>
        </div>

        {/* 404 number */}
        <div className={`notfound-number${glitch ? " notfound-glitch" : ""}`} style={vis(2)}>
          404
          {glitch && <span className="notfound-glitch-copy">404</span>}
        </div>

        {/* Icon */}
        <div className="notfound-icon-wrap" style={vis(2)}>
          <Icon name="shield-check" size={40} color="#1f2937" />
          <div className="notfound-icon-x">
            <Icon name="x" size={20} color="#ef4444" />
          </div>
        </div>

        {/* Text */}
        <h1 className="notfound-title" style={vis(3)}>Page Not Found</h1>
        <p className="notfound-sub" style={vis(3)}>
          The page you're looking for doesn't exist or you don't have permission to view it.
        </p>

        {/* Actions */}
        <div className="notfound-actions" style={vis(4)}>
          <button className="btn-hero-primary" onClick={onBack}>
            <Icon name="house" size={16} />
            Back to Home
          </button>
        </div>

        {/* Footer note */}
        <p className="notfound-footer" style={vis(4)}>
          <Icon name="shield-check" size={12} color="#10b981" />
          BHF DataGuardian · Secure Health Data Collection
        </p>
      </div>
    </div>
  );
}