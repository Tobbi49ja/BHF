// src/components/ServerWake.jsx
import { useEffect, useState } from "react";
import Icon from "./Icon";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export default function ServerWake({ children }) {
  const [status, setStatus] = useState("waking");
  const [dots,   setDots]   = useState("");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);

    // Elapsed timer
    const elapsedInterval = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);

    // Ping backend
    const ping = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/`, { method: "GET" });
        if (res.ok) {
          setStatus("ready");
        } else {
          retry();
        }
      } catch {
        retry();
      }
    };

    // Retry every 4 seconds until alive
    let retryTimer;
    const retry = () => {
      retryTimer = setTimeout(ping, 4000);
    };

    // Timeout after 60 seconds — show app anyway
    const timeoutTimer = setTimeout(() => {
      setStatus("timeout");
    }, 60000);

    ping(); // first ping immediately

    return () => {
      clearInterval(dotsInterval);
      clearInterval(elapsedInterval);
      clearTimeout(retryTimer);
      clearTimeout(timeoutTimer);
    };
  }, []);

  // Server is up or timed out — show the app
  if (status === "ready" || status === "timeout") {
    return children;
  }

  // Waking screen
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg, #0a0a0a)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute", top: "-150px", left: "50%",
        transform: "translateX(-50%)", width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", position: "relative", zIndex: 2, maxWidth: 420,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "2.5rem" }}>
          <div className="landing-logo-icon">
            <Icon name="shield-plus" size={18} />
          </div>
          <div className="landing-logo-text">
            <span className="landing-logo-main">BHF</span>
            <span className="landing-logo-sub">DataGuardian</span>
          </div>
        </div>

        {/* Pulse ring */}
        <div style={{ position: "relative", width: 80, height: 80, marginBottom: "2rem" }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid rgba(16,185,129,0.15)",
            animation: "pingRing 1.8s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", inset: 8, borderRadius: "50%",
            border: "2px solid rgba(16,185,129,0.25)",
            animation: "pingRing 1.8s ease-in-out infinite 0.3s",
          }} />
          <div style={{
            position: "absolute", inset: 16, borderRadius: "50%",
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="server" size={20} color="#10b981" />
          </div>
        </div>

        {/* Text */}
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontSize: "1.4rem", fontWeight: 800,
          color: "var(--text, #fff)", letterSpacing: "-0.02em", marginBottom: "0.5rem",
        }}>
          Starting up{dots}
        </h2>
        <p style={{
          fontSize: "0.9rem", color: "var(--text-2, #9ca3af)",
          lineHeight: 1.6, marginBottom: "1.75rem", maxWidth: 320,
        }}>
          The server is waking up from sleep. This usually takes <strong style={{ color: "var(--text, #fff)" }}>15–30 seconds</strong> on the free tier.
        </p>

        {/* Progress bar */}
        <div style={{
          width: "100%", maxWidth: 280, height: 4,
          background: "rgba(255,255,255,0.06)", borderRadius: 999,
          overflow: "hidden", marginBottom: "1rem",
        }}>
          <div style={{
            height: "100%", borderRadius: 999,
            background: "linear-gradient(90deg, #10b981, #2563eb)",
            width: `${Math.min((elapsed / 30) * 100, 95)}%`,
            transition: "width 1s ease",
          }} />
        </div>

        {/* Timer */}
        <p style={{ fontSize: "0.78rem", color: "var(--text-3, #6b7280)" }}>
          {elapsed}s elapsed
        </p>

        {/* Keyframes injected inline */}
        <style>{`
          @keyframes pingRing {
            0%   { transform: scale(1);    opacity: 0.6; }
            50%  { transform: scale(1.15); opacity: 0.2; }
            100% { transform: scale(1);    opacity: 0.6; }
          }
        `}</style>
      </div>
    </div>
  );
}