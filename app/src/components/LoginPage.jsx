import { useState } from "react";
import Icon from "./Icon";
import { loginUser, registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ROLES = ["Field Volunteer", "Health Worker", "Program Manager", "Data Analyst", "Administrator"];

export default function LoginPage({ onSuccess, onBack, lang = "en" }) {
  const { login } = useAuth();
  const [mode,     setMode]     = useState("login");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [form,     setForm]     = useState({ fullName: "", email: "", password: "", role: "Field Volunteer" });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = mode === "login"
        ? await loginUser({ email: form.email, password: form.password })
        : await registerUser({ fullName: form.fullName, email: form.email, password: form.password, role: form.role });
      login(data);
      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setMode((m) => m === "login" ? "register" : "login"); setError(""); };

  return (
    <div className="login-page">
      <div className="login-bg-glow" />
      <div className="login-bg-grid" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="landing-logo-icon"><Icon name="shield-plus" size={20} /></div>
          <div className="landing-logo-text">
            <span className="landing-logo-main">BHF</span>
            <span className="landing-logo-sub">DataGuardian</span>
          </div>
        </div>

        {/* Mode tabs */} 
        <div className="auth-mode-tabs">
          <button className={`auth-mode-tab${mode === "login" ? " active" : ""}`} onClick={() => { setMode("login"); setError(""); }}>
            <Icon name="lock" size={13} /> Sign In
          </button>
          <button className={`auth-mode-tab${mode === "register" ? " active" : ""}`} onClick={() => { setMode("register"); setError(""); }}>
            <Icon name="user-round" size={13} /> Register
          </button>
        </div>

        <h2 className="login-title">{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
        <p className="login-sub">
          {mode === "login"
            ? "Sign in to access BHF DataGuardian"
            : "Register to join BHF DataGuardian"}
        </p>

        {error && (
          <div className="login-error">
            <Icon name="x" size={13} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {mode === "register" && (
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <Icon name="user" size={16} className="input-icon" />
                <input type="text" placeholder="e.g. Amina Musa" value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)} required />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Icon name="mail" size={16} className="input-icon" />
              <input type="email" placeholder="you@bhf.org" value={form.email}
                onChange={(e) => set("email", e.target.value)} required />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Icon name="lock" size={16} className="input-icon" />
              <input type={showPw ? "text" : "password"} placeholder="••••••••"
                value={form.password} onChange={(e) => set("password", e.target.value)}
                style={{ paddingRight: "3rem" }} required />
              <button type="button" className="pw-toggle" onClick={() => setShowPw((p) => !p)}>
                <Icon name={showPw ? "eye-off" : "eye"} size={15} />
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div className="input-group">
              <label>Role</label>
              <div className="input-wrapper">
                <Icon name="badge-check" size={16} className="input-icon" />
                <select value={form.role} onChange={(e) => set("role", e.target.value)}>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <Icon name="chevron-down" size={14} className="select-arrow" />
              </div>
            </div>
          )}

          {mode === "login" && (
            <div className="login-role-hint">
              <Icon name="shield-check" size={13} color="#10b981" />
              Role-based access — permissions are set by your account.
            </div>
          )}

          <button type="submit" className="btn btn-success login-btn" disabled={loading}>
            {loading
              ? <><span className="login-spinner" />{mode === "login" ? "Signing in..." : "Creating..."}</>
              : <>{mode === "login" ? "Sign In" : "Create Account"} <Icon name="arrow-right" size={15} /></>
            }
          </button>
        </form>

        <button className="back-to-home" style={{ margin: "1rem auto 0", display: "flex" }} onClick={onBack}>
          <Icon name="arrow-left" size={13} /> Back to Home
        </button>
      </div>
    </div>
  );
}
