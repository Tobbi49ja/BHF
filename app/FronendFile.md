 import { useState, useEffect } from "react";
import Icon from "./Icon";

/* ─────────────────────────────────────────
   I18N
───────────────────────────────────────── */
const text = {
  en: {
    login: {
      title: "Welcome Back",
      sub: "Sign in to your BHF DataGuardian account",
      email: "Email Address",
      password: "Password",
      forgot: "Forgot password?",
      btn: "Sign In",
      or: "or continue with",
      switch: "Don't have an account?",
      switchLink: "Create one",
      emailPlaceholder: "you@bhf.org",
      passwordPlaceholder: "Enter your password",
    },
    signup: {
      title: "Create Account",
      sub: "Join BHF DataGuardian — secure community health data collection",
      fullName: "Full Name",
      email: "Email Address",
      role: "Role",
      roleOptions: ["Select your role", "Field Volunteer", "Health Worker", "Program Manager", "Data Analyst", "Administrator"],
      password: "Password",
      confirm: "Confirm Password",
      terms: "I agree to the Terms of Service and Privacy Policy",
      btn: "Create Account",
      or: "or sign up with",
      switch: "Already have an account?",
      switchLink: "Sign in",
      namePlaceholder: "e.g. Amina Musa",
      emailPlaceholder: "you@bhf.org",
      passwordPlaceholder: "Min. 8 characters",
      confirmPlaceholder: "Re-enter password",
    },
    badge: "Beyond Health Foundation",
    secure: "256-bit encrypted · Zero data breaches",
  },
  ha: {
    login: {
      title: "Barka da Komowa",
      sub: "Shiga asusun BHF DataGuardian",
      email: "Adireshin Imel",
      password: "Kalmar Sirri",
      forgot: "Manta kalmar sirri?",
      btn: "Shiga",
      or: "ko ci gaba da",
      switch: "Ba ka da asusu?",
      switchLink: "Ƙirƙira ɗaya",
      emailPlaceholder: "kai@bhf.org",
      passwordPlaceholder: "Shigar da kalmar sirri",
    },
    signup: {
      title: "Ƙirƙiri Asusu",
      sub: "Shiga BHF DataGuardian — tattara bayanin lafiya cikin tsaro",
      fullName: "Cikakken Suna",
      email: "Adireshin Imel",
      role: "Matsayi",
      roleOptions: ["Zaɓi matsayinka", "Mai Sa Kai", "Ma'aikacin Lafiya", "Manajan Shiri", "Mai Nazarin Bayanai", "Gudanarwa"],
      password: "Kalmar Sirri",
      confirm: "Tabbatar da Kalmar Sirri",
      terms: "Na yarda da Sharuɗɗa da Manufofin Sirri",
      btn: "Ƙirƙiri Asusu",
      or: "ko yi rajista da",
      switch: "Kana da asusu?",
      switchLink: "Shiga",
      namePlaceholder: "misali: Amina Musa",
      emailPlaceholder: "kai@bhf.org",
      passwordPlaceholder: "Min. haruffa 8",
      confirmPlaceholder: "Sake shigar da kalmar sirri",
    },
    badge: "Gidauniyar Lafiya ta BHF",
    secure: "Ɓoye 256-bit · Babu lalacewar bayanai",
  },
};

const LANGUAGES = [
  { code: "en", label: "EN" }, { code: "ha", label: "HA" },
  { code: "yo", label: "YO" }, { code: "ig", label: "IG" },
  { code: "fr", label: "FR" }, { code: "ar", label: "AR" },
];

/* ─────────────────────────────────────────
   PASSWORD STRENGTH METER
───────────────────────────────────────── */
function PasswordStrength({ password }) {
  const getStrength = (p) => {
    if (!p) return { score: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
    if (score <= 2) return { score, label: "Fair", color: "#f59e0b" };
    if (score <= 3) return { score, label: "Good", color: "#3b82f6" };
    return { score, label: "Strong", color: "#10b981" };
  };
  const { score, label, color } = getStrength(password);
  if (!password) return null;
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1,2,3,4].map((i) => (
          <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= Math.ceil(score / 1.25) ? color : "var(--dark-border)", transition: "background 0.3s ease" }} />
        ))}
      </div>
      <span style={{ fontSize: "0.72rem", color, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   LEFT PANEL (branding)
───────────────────────────────────────── */
function BrandPanel({ mode }) {
  const [floatIndex, setFloatIndex] = useState(0);
  const metrics = [
    { label: "Encrypted Records", value: "12,847", icon: "shield-check" },
    { label: "Active Volunteers", value: "1,203", icon: "users" },
    { label: "Communities Served", value: "94", icon: "map-pin" },
    { label: "Data Accuracy", value: "99.8%", icon: "trending-up" },
  ];
  useEffect(() => {
    const t = setInterval(() => setFloatIndex((p) => (p + 1) % metrics.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="auth-brand-panel">
      <div className="auth-brand-glow auth-brand-glow-1" />
      <div className="auth-brand-glow auth-brand-glow-2" />
      <div className="auth-brand-grid" />

      <div className="auth-brand-content">
        {/* Logo */}
        <div className="auth-brand-logo">
          <div className="auth-brand-logo-icon">
            <Icon name="shield-plus" size={28} />
          </div>
          <div>
            <div className="auth-brand-logo-main">BHF</div>
            <div className="auth-brand-logo-sub">DataGuardian</div>
          </div>
        </div>

        {/* Tagline */}
        <div className="auth-brand-tagline">
          <h2>Community health data,<br /><span className="auth-brand-accent">protected with purpose.</span></h2>
          <p>Trusted by field volunteers across Nigeria to capture, store, and protect beneficiary health records — securely and accurately.</p>
        </div>

        {/* Floating metrics card */}
        <div className="auth-metrics-card">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="auth-metric-row"
              style={{
                opacity: i === floatIndex ? 1 : 0.3,
                transform: i === floatIndex ? "translateX(0)" : "translateX(-6px)",
                transition: "all 0.5s ease",
              }}
            >
              <div className="auth-metric-icon">
                <Icon name={m.icon} size={14} />
              </div>
              <span className="auth-metric-label">{m.label}</span>
              <span className="auth-metric-value">{m.value}</span>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="auth-trust-badges">
          <div className="auth-trust-badge">
            <Icon name="shield-check" size={13} color="#10b981" />
            <span>256-bit TLS</span>
          </div>
          <div className="auth-trust-badge">
            <Icon name="lock" size={13} color="#10b981" />
            <span>HIPAA Aligned</span>
          </div>
          <div className="auth-trust-badge">
            <Icon name="globe" size={13} color="#10b981" />
            <span>6 Languages</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   LOGIN FORM
───────────────────────────────────────── */
function LoginForm({ lang, onSwitch, onSuccess }) {
  const t = (text[lang] || text.en).login;
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [100, 200, 300, 400].map((d, i) => setTimeout(() => setPhase(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  const vis = (p) => ({
    opacity: phase >= p ? 1 : 0,
    transform: phase >= p ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.45s ease ${p * 60}ms, transform 0.45s ease ${p * 60}ms`,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess && onSuccess(); }, 1600);
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header" style={vis(1)}>
        <h1 className="auth-form-title">{t.title}</h1>
        <p className="auth-form-sub">{t.sub}</p>
      </div>

      {error && (
        <div className="auth-error">
          <Icon name="x" size={14} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group" style={vis(2)}>
          <label>{t.email}</label>
          <div className="input-wrapper">
            <Icon name="mail" size={16} className="input-icon" />
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="input-group" style={vis(3)}>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {t.password}
            <button type="button" className="auth-forgot-link">{t.forgot}</button>
          </label>
          <div className="input-wrapper">
            <Icon name="lock" size={16} className="input-icon" />
            <input
              type={showPass ? "text" : "password"}
              placeholder={t.passwordPlaceholder}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ paddingRight: "3rem" }}
              required
            />
            <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)}>
              <Icon name={showPass ? "x" : "user"} size={15} />
            </button>
          </div>
        </div>

        <div style={vis(4)}>
          <button type="submit" className={`auth-btn-primary${loading ? " auth-btn-loading" : ""}`} disabled={loading}>
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              <>
                {t.btn}
                <Icon name="arrow-right" size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="auth-divider" style={vis(4)}>
        <span>{t.or}</span>
      </div>

      <div className="auth-social-row" style={vis(4)}>
        <button className="auth-social-btn">
          <Icon name="globe" size={16} />
          Google
        </button>
        <button className="auth-social-btn">
          <Icon name="building-2" size={16} />
          Microsoft
        </button>
      </div>

      <p className="auth-switch-text" style={vis(4)}>
        {t.switch}{" "}
        <button type="button" className="auth-switch-link" onClick={onSwitch}>{t.switchLink}</button>
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   SIGNUP FORM
───────────────────────────────────────── */
function SignupForm({ lang, onSwitch, onSuccess }) {
  const t = (text[lang] || text.en).signup;
  const [form, setForm] = useState({ fullName: "", email: "", role: "", password: "", confirm: "", terms: false });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setPhase(0);
    const timers = [80, 160, 240, 320, 400, 480].map((d, i) => setTimeout(() => setPhase(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  const vis = (p) => ({
    opacity: phase >= p ? 1 : 0,
    transform: phase >= p ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.4s ease ${p * 50}ms, transform 0.4s ease ${p * 50}ms`,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.role || !form.password) { setError("Please fill in all required fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (!form.terms) { setError("Please accept the Terms of Service."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess && onSuccess(); }, 1800);
  };

  const passwordMatch = form.confirm && form.password === form.confirm;
  const passwordMismatch = form.confirm && form.password !== form.confirm;

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header" style={vis(1)}>
        <h1 className="auth-form-title">{t.title}</h1>
        <p className="auth-form-sub">{t.sub}</p>
      </div>

      {error && (
        <div className="auth-error">
          <Icon name="x" size={14} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-form-grid">
          <div className="input-group" style={vis(2)}>
            <label>{t.fullName}</label>
            <div className="input-wrapper">
              <Icon name="user-round" size={16} className="input-icon" />
              <input type="text" placeholder={t.namePlaceholder} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            </div>
          </div>

          <div className="input-group" style={vis(2)}>
            <label>{t.email}</label>
            <div className="input-wrapper">
              <Icon name="mail" size={16} className="input-icon" />
              <input type="email" placeholder={t.emailPlaceholder} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
        </div>

        <div className="input-group" style={vis(3)}>
          <label>{t.role}</label>
          <div className="input-wrapper">
            <Icon name="briefcase" size={16} className="input-icon" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
              {t.roleOptions.map((opt, i) => (
                <option key={i} value={i === 0 ? "" : opt} disabled={i === 0}>{opt}</option>
              ))}
            </select>
            <Icon name="chevron-down" size={14} className="select-arrow" />
          </div>
        </div>

        <div className="auth-form-grid">
          <div className="input-group" style={vis(4)}>
            <label>{t.password}</label>
            <div className="input-wrapper">
              <Icon name="lock" size={16} className="input-icon" />
              <input
                type={showPass ? "text" : "password"}
                placeholder={t.passwordPlaceholder}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: "3rem" }}
                required
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)}>
                <Icon name={showPass ? "x" : "user"} size={15} />
              </button>
            </div>
            <PasswordStrength password={form.password} />
          </div>

          <div className="input-group" style={vis(4)}>
            <label>{t.confirm}</label>
            <div className="input-wrapper">
              <Icon name="shield-check" size={16} className="input-icon" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder={t.confirmPlaceholder}
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                style={{ paddingRight: "3rem", borderColor: passwordMatch ? "#10b981" : passwordMismatch ? "#ef4444" : undefined }}
                required
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                <Icon name={showConfirm ? "x" : "user"} size={15} />
              </button>
            </div>
            {passwordMatch && <p style={{ fontSize: "0.72rem", color: "#10b981", marginTop: "4px", fontWeight: 600 }}>✓ Passwords match</p>}
            {passwordMismatch && <p style={{ fontSize: "0.72rem", color: "#ef4444", marginTop: "4px", fontWeight: 600 }}>✗ Passwords don't match</p>}
          </div>
        </div>

        <div className="auth-terms-row" style={vis(5)}>
          <label className="auth-checkbox-label">
            <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} className="auth-checkbox" />
            <span className="auth-checkbox-custom">
              {form.terms && <Icon name="check" size={11} />}
            </span>
            <span>{t.terms}</span>
          </label>
        </div>

        <div style={vis(6)}>
          <button type="submit" className={`auth-btn-primary${loading ? " auth-btn-loading" : ""}`} disabled={loading}>
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              <>
                {t.btn}
                <Icon name="arrow-right" size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="auth-divider" style={vis(6)}>
        <span>{t.or}</span>
      </div>

      <div className="auth-social-row" style={vis(6)}>
        <button className="auth-social-btn">
          <Icon name="globe" size={16} />
          Google
        </button>
        <button className="auth-social-btn">
          <Icon name="building-2" size={16} />
          Microsoft
        </button>
      </div>

      <p className="auth-switch-text" style={vis(6)}>
        {t.switch}{" "}
        <button type="button" className="auth-switch-link" onClick={onSwitch}>{t.switchLink}</button>
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN AUTH PAGE
───────────────────────────────────────── */
function AuthPage({ onAuthSuccess, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "signup" | "success"
  const [lang, setLang] = useState("en");
  const isRTL = lang === "ar";

  const switchMode = () => {
    setMode((m) => m === "login" ? "signup" : "login");
  };

  if (mode === "success") {
    return (
      <div className="auth-success-screen">
        <div className="auth-success-card">
          <div className="auth-success-icon">
            <Icon name="check-circle-2" size={52} color="#10b981" />
          </div>
          <div className="success-brand" style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
            <Icon name="shield-plus" size={18} color="#10b981" />
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>BHF DataGuardian</span>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>You're In!</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Authentication successful. Redirecting to your dashboard...</p>
          <button className="auth-btn-primary" onClick={() => onAuthSuccess && onAuthSuccess()} style={{ maxWidth: "240px", margin: "0 auto" }}>
            Go to Dashboard
            <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" dir={isRTL ? "rtl" : "ltr"}>
      {/* Lang pills top-right */}
      <div className="auth-lang-bar">
        {LANGUAGES.map((l) => (
          <button key={l.code} className={`lang-pill${lang === l.code ? " active" : ""}`} onClick={() => setLang(l.code)}>{l.label}</button>
        ))}
      </div>

      {/* Split layout */}
      <div className="auth-split">
        {/* LEFT: Brand panel */}
        <BrandPanel mode={mode} />

        {/* RIGHT: Form panel */}
        <div className="auth-form-panel">
          <div className="auth-form-panel-inner">
            {/* Mode tabs */}
            <div className="auth-mode-tabs">
              <button className={`auth-mode-tab${mode === "login" ? " active" : ""}`} onClick={() => setMode("login")}>
                <Icon name="lock" size={14} />
                Sign In
              </button>
              <button className={`auth-mode-tab${mode === "signup" ? " active" : ""}`} onClick={() => setMode("signup")}>
                <Icon name="user-round" size={14} />
                Sign Up
              </button>
            </div>

            {/* Form with transition */}
            <div key={mode} className="auth-form-anim">
              {mode === "login" ? (
                <LoginForm lang={lang} onSwitch={switchMode} onSuccess={() => setMode("success")} />
              ) : (
                <SignupForm lang={lang} onSwitch={switchMode} onSuccess={() => setMode("success")} />
              )}
            </div>

            {/* Secure footer */}
            <div className="auth-secure-footer">
              <Icon name="shield-check" size={13} color="#10b981" />
              <span>{(text[lang] || text.en).secure}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
import {
  Activity, ArrowLeft, ArrowRight, BadgeCheck, BarChart2,
  Briefcase, Building2, Calculator, Calendar, Check,
  CheckCircle2, ChevronDown, ClipboardList, Droplets,
  Eye, EyeOff, Factory, FileText, Globe, HeartPulse,
  House, Lock, LogOut, Mail, MapPin, Menu, Mic, Phone,
  Ruler, Scale, ShieldCheck, ShieldPlus, Smartphone,
  Star, TrendingUp, User, UserRound, Users, X,
} from "lucide-react";

const iconMap = {
  "activity":       Activity,
  "arrow-left":     ArrowLeft,
  "arrow-right":    ArrowRight,
  "badge-check":    BadgeCheck,
  "bar-chart-2":    BarChart2,
  "briefcase":      Briefcase,
  "building-2":     Building2,
  "calculator":     Calculator,
  "calendar":       Calendar,
  "check":          Check,
  "check-circle-2": CheckCircle2,
  "chevron-down":   ChevronDown,
  "clipboard-list": ClipboardList,
  "droplets":       Droplets,
  "eye":            Eye,
  "eye-off":        EyeOff,
  "factory":        Factory,
  "file-text":      FileText,
  "globe":          Globe,
  "heart-pulse":    HeartPulse,
  "house":          House,
  "lock":           Lock,
  "log-out":        LogOut,
  "mail":           Mail,
  "map-pin":        MapPin,
  "menu":           Menu,
  "mic":            Mic,
  "phone":          Phone,
  "ruler":          Ruler,
  "scale":          Scale,
  "shield-check":   ShieldCheck,
  "shield-plus":    ShieldPlus,
  "smartphone":     Smartphone,
  "star":           Star,
  "trending-up":    TrendingUp,
  "user":           User,
  "user-round":     UserRound,
  "users":          Users,
  "x":              X,
};

function Icon({ name, size = 20, color, className, style }) {
  const Component = iconMap[name];
  if (!Component) return <span style={{ display: "inline-block", width: size, height: size }} />;
  return <Component size={size} color={color} className={className} style={style} strokeWidth={1.75} />;
}

export default Icon;
import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "./Icon";

function useCountUp(end, duration = 1800, decimals = 0) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setStarted(true); }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration, decimals]);
  return { ref, count };
}

function useInView(threshold = 0.2) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function StatItem({ value, label, delay = 0 }) {
  const match = value.match(/^(\d+\.?\d*)(.*)$/);
  const numericEnd = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const decimals = (match && match[1].includes(".")) ? 1 : 0;
  const { ref, count } = useCountUp(numericEnd, 1800, decimals);
  const { ref: wrapRef, inView } = useInView(0.3);
  const setRefs = useCallback((el) => { ref.current = el; wrapRef.current = el; }, []);
  return (
    <div className="stat-item" ref={setRefs} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      <span className="stat-value">{numericEnd > 0 ? count : value}{suffix && numericEnd > 0 ? suffix : ""}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function HowStep({ num, title, desc, delay, isLast }) {
  const { ref, inView } = useInView(0.2);
  return (
    <div className="how-step" ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      <div className={`how-step-num${inView ? " how-step-pop" : ""}`}>{num}</div>
      <div className="how-step-content"><h3>{title}</h3><p>{desc}</p></div>
      {!isLast && <div className="how-connector"></div>}
    </div>
  );
}

const CARD_METRICS = [
  { label: "Blood Pressure", value: 120, color: "good", display: (v) => `${v}/80 mmHg` },
  { label: "Blood Sugar",    value: 105, color: "warn", display: (v) => `${v} mg/dL` },
  { label: "BMI",            value: 22,  color: "good", display: (v) => `${v}.4 — Normal` },
  { label: "Weight",         value: 68,  color: "good", display: (v) => `${v} kg` },
];

function AnimatedHeroCard() {
  const [activeRow, setActiveRow] = useState(0);
  const [counts, setCounts] = useState(CARD_METRICS.map(() => 0));
  const [pulse, setPulse] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const runCount = (rowIdx) => {
      const target = CARD_METRICS[rowIdx].value;
      const duration = 900;
      let start = null;
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
      const step = (ts) => {
        if (cancelled) return;
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCounts((prev) => { const next = [...prev]; next[rowIdx] = Math.round(eased * target); return next; });
        if (progress < 1) requestAnimationFrame(step);
        else if (rowIdx === CARD_METRICS.length - 1) {
          setSynced(true);
          setTimeout(() => { if (!cancelled) { setSynced(false); setCounts(CARD_METRICS.map(() => 0)); setActiveRow(0); } }, 2200);
        }
      };
      requestAnimationFrame(step);
    };
    const timer = setTimeout(() => runCount(activeRow), activeRow === 0 ? 600 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [activeRow]);

  useEffect(() => {
    if (counts[activeRow] === CARD_METRICS[activeRow].value && activeRow < CARD_METRICS.length - 1) {
      const t = setTimeout(() => setActiveRow((p) => p + 1), 300);
      return () => clearTimeout(t);
    }
  }, [counts, activeRow]);

  return (
    <div className="hero-card">
      <div className="hero-card-header">
        <div className="hero-card-dot green"></div>
        <div className="hero-card-dot yellow"></div>
        <div className="hero-card-dot red"></div>
        <span className="hero-card-title">Health Screening</span>
        {pulse && <span className="card-pulse-dot"></span>}
      </div>
      <div className="hero-card-rows">
        {CARD_METRICS.map((m, i) => (
          <div className={`hero-card-row${i === activeRow ? " row-active" : ""}${i < activeRow ? " row-done" : ""}`} key={i}>
            <span className="hcr-label">{i < activeRow && <span className="row-check">✓ </span>}{m.label}</span>
            <span className={`hcr-value ${i <= activeRow ? m.color : "hcr-empty"}`}>{i <= activeRow ? m.display(counts[i]) : "—"}</span>
          </div>
        ))}
        <div className="hero-card-row">
          <span className="hcr-label">Volunteer</span>
          <span className="hcr-value muted">Aisha Musa</span>
        </div>
      </div>
      <div className="hero-card-footer">
        <Icon name="shield-check" size={13} color="#10b981" />
        <span className={synced ? "footer-synced" : ""}>{synced ? "✓ Record Synced!" : "Encrypted · Syncing..."}</span>
        {synced && <span className="footer-sync-badge">LIVE</span>}
      </div>
      <div className="card-progress-bar">
        <div className="card-progress-fill" style={{ width: `${((activeRow + (counts[activeRow] / CARD_METRICS[activeRow].value)) / CARD_METRICS.length) * 100}%` }}></div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  const { ref, inView } = useInView(0.15);
  return (
    <div className="feature-card" ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)", transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms` }}>
      <div className="feature-icon"><Icon name={icon} size={22} /></div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}

function HeroContent({ t, onStart }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const delays = [100, 350, 600, 900, 1200];
    const timers = delays.map((d, i) => setTimeout(() => setPhase(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);
  const vis = (minPhase) => ({
    opacity: phase >= minPhase ? 1 : 0,
    transform: phase >= minPhase ? "translateY(0)" : "translateY(22px)",
    transition: "opacity 0.65s ease, transform 0.65s ease",
  });
  return (
    <div className="hero-content">
      <div className="hero-badge" style={vis(1)}>
        <Icon name="shield-check" size={13} />
        {t.hero.badge}
      </div>
      <h1 className="hero-title">
        <span className="hero-title-line1" style={vis(2)}>{t.hero.title1}</span>
        <span className="hero-title-line2" style={vis(3)}>{t.hero.title2}</span>
      </h1>
      <p className="hero-sub" style={vis(4)}>{t.hero.sub}</p>
      <div className="hero-actions" style={vis(5)}>
        <button className="btn-hero-primary" onClick={onStart}>
          {t.hero.cta}
          <Icon name="arrow-right" size={18} />
        </button>
        <a href="#features" className="btn-hero-secondary">
          {t.hero.secondary}
          <Icon name="chevron-down" size={16} />
        </a>
      </div>
    </div>
  );
}

const LANGUAGES = [
  { code: "en", label: "EN" }, { code: "ha", label: "HA" },
  { code: "yo", label: "YO" }, { code: "ig", label: "IG" },
  { code: "fr", label: "FR" }, { code: "ar", label: "AR" },
];

const langText = {
  en: {
    nav: { features: "Features", about: "About", security: "Security", cta: "Start Recording" },
    hero: { badge: "Beyond Health Foundation", title1: "Community Health", title2: "Data, Dignified.", sub: "DataGuardian empowers field volunteers to capture beneficiary profiles, health screenings, and program feedback — securely, accurately, and in your language.", cta: "Begin Intake Form", secondary: "Learn More" },
    stats: [{ value: "100%", label: "Encrypted Storage" }, { value: "6+", label: "Languages Supported" }, { value: "3", label: "Min. Avg Entry Time" }, { value: "0", label: "Data Breaches" }],
    featuresTitle: "Built for the Field",
    featuresSub: "Every feature designed around real volunteer needs.",
    features: [
      { icon: "shield-check",   title: "End-to-End Encryption",    desc: "All beneficiary data is encrypted at rest and in transit. Role-based access ensures only authorized staff can view records." },
      { icon: "heart-pulse",    title: "Health Screening Metrics", desc: "Capture blood pressure, blood sugar, weight, height and auto-calculated BMI with built-in clinical reference ranges." },
      { icon: "globe",          title: "Multilingual Interface",   desc: "Full support for English, Hausa, Yoruba, Igbo, French and Arabic — switch instantly without losing form progress." },
      { icon: "check-circle-2", title: "Smart Validation",         desc: "Real-time field validation minimizes data entry errors before submission, reducing the need for corrections later." },
      { icon: "bar-chart-2",    title: "Analytics Ready",          desc: "Structured data exports feed directly into your reporting dashboards for program adjustments and donor reports." },
      { icon: "smartphone",     title: "Mobile Optimized",         desc: "Designed first for Android field workers — fast, offline-capable, and easy to use in low-connectivity environments." },
    ],
    howTitle: "How It Works",
    howSteps: [
      { num: "01", title: "Volunteer Logs In",           desc: "Role-based access grants volunteers access only to the intake form — no sensitive data exposed." },
      { num: "02", title: "Capture Beneficiary Profile", desc: "Enter personal details, contact information and community location in Step 1." },
      { num: "03", title: "Record Health Metrics",       desc: "Input screening results — BP, blood sugar, weight and height. BMI is calculated automatically." },
      { num: "04", title: "Submit & Sync",               desc: "Record is encrypted, timestamped and synced to the BHF central database instantly." },
    ],
    footer: { tagline: "Protecting community health data with dignity.", rights: "© 2025 Beyond Health Foundation. All rights reserved." },
  },
  ha: {
    nav: { features: "Fasali", about: "Game da mu", security: "Tsaro", cta: "Fara Rikodin" },
    hero: { badge: "Gidauniyar Lafiya ta BHF", title1: "Bayanin Lafiya", title2: "Na Al'umma, Da Daraja.", sub: "DataGuardian yana taimaka wa masu sa kai wajen tattara bayanai, gwajin lafiya, da ra'ayoyin shiri — cikin tsaro, daidaito, da harshenku.", cta: "Fara Fom", secondary: "Ƙara Sani" },
    stats: [{ value: "100%", label: "Adana Sirri" }, { value: "6+", label: "Harsuna" }, { value: "3", label: "Lokacin Shigarwa" }, { value: "0", label: "Lalacewar Bayanai" }],
    featuresTitle: "An Gina Don Filin Aiki",
    featuresSub: "Kowace fasali an tsara ta don bukatar masu sa kai.",
    features: [
      { icon: "shield-check",   title: "Ɓoye Bayanai",        desc: "Duk bayanin amfani an ɓoye shi. Samun dama bisa matsayi yana tabbatar da kawai ma'aikata ne ke iya ganin rikodin." },
      { icon: "heart-pulse",    title: "Gwajin Lafiya",        desc: "Rikodin BP, sukari, nauyi, tsawo da BMI da aka lissafa kai tsaye tare da ma'auni na likitanci." },
      { icon: "globe",          title: "Harsuna Da Yawa",      desc: "Cikakken tallafi don Turanci, Hausa, Yoruba, Igbo, Faransanci da Larabci." },
      { icon: "check-circle-2", title: "Tabbatarwa Mai Wayo",  desc: "Tabbatar da filin a lokaci na gaske yana rage kuskuren shigarwa kafin a aika." },
      { icon: "bar-chart-2",    title: "Shirye don Bincike",   desc: "Fitar da bayanan tsari kai tsaye zuwa kallo don gyara shirin da rahotanni." },
      { icon: "smartphone",     title: "An Inganta don Wayar", desc: "An tsara farko don ma'aikatan Android — sauƙi da amfani a wuraren da babu intanet." },
    ],
    howTitle: "Yadda Yake Aiki",
    howSteps: [
      { num: "01", title: "Mai Sa Kai Ya Shiga",       desc: "Samun dama bisa matsayi yana ba masu sa kai damar shiga fom kawai." },
      { num: "02", title: "Rikodin Bayanan Amfani",    desc: "Shigar da cikakken sunan, lambar wayar da wurin al'umma a mataki na 1." },
      { num: "03", title: "Rikodin Gwajin Lafiya",     desc: "Shigar da sakamakon gwajin — BP, sukari, nauyi da tsawo. BMI yana lissafawa kai tsaye." },
      { num: "04", title: "Aika & Haɗa",               desc: "Rikodin an ɓoye shi, an saka lokaci kuma an haɗa shi da bayanan BHF nan take." },
    ],
    footer: { tagline: "Kare bayanin lafiya na al'umma da daraja.", rights: "© 2025 Gidauniyar Lafiya ta BHF. Duk haƙƙoƙi an kiyaye su." },
  },
};

const getText = (lang) => langText[lang] || langText.en;

function LandingPage({ onStart, lang, setLang }) {
  const t = getText(lang);
  const isRTL = lang === "ar";

  return (
    <div className="landing" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── NAV ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <div className="landing-logo-icon"><Icon name="shield-plus" size={20} /></div>
            <div className="landing-logo-text">
              <span className="landing-logo-main">BHF</span>
              <span className="landing-logo-sub">DataGuardian</span>
            </div>
          </div>
          <div className="landing-nav-links">
            <a href="#features" className="nav-link">{t.nav.features}</a>
            <a href="#how"      className="nav-link">{t.nav.about}</a>
            <a href="#security" className="nav-link">{t.nav.security}</a>
          </div>
          <div className="landing-nav-right">
            <div className="lang-pills">
              {LANGUAGES.map((l) => (
                <button key={l.code} className={`lang-pill${lang === l.code ? " active" : ""}`} onClick={() => setLang(l.code)}>{l.label}</button>
              ))}
            </div>
            <button className="btn-nav-cta" onClick={onStart}>
              {t.nav.cta}
              <Icon name="arrow-right" size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="landing-hero">
        <div className="hero-bg-grid"></div>
        <div className="hero-bg-glow"></div>
        <div className="hero-bg-glow hero-bg-glow-2"></div>
        <HeroContent t={t} onStart={onStart} />
        <div className="hero-visual"><AnimatedHeroCard /></div>
      </section>

      {/* ── STATS ── */}
      <section className="landing-stats">
        {t.stats.map((s, i) => <StatItem key={i} value={s.value} label={s.label} delay={i * 120} />)}
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-features" id="features">
        <div className="section-header">
          <div className="section-tag">Features</div>
          <h2 className="section-title-lg">{t.featuresTitle}</h2>
          <p className="section-sub">{t.featuresSub}</p>
        </div>
        <div className="features-grid">
          {t.features.map((f, i) => <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} delay={i * 80} />)}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-how" id="how">
        <div className="section-header">
          <div className="section-tag">Process</div>
          <h2 className="section-title-lg">{t.howTitle}</h2>
        </div>
        <div className="how-steps">
          {t.howSteps.map((s, i) => (
            <HowStep key={i} num={s.num} title={s.title} desc={s.desc} delay={i * 180} isLast={i === t.howSteps.length - 1} />
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="landing-cta-banner" id="security">
        <div className="cta-banner-inner">
          <div className="cta-banner-icons">
            <Icon name="shield-check" size={32} color="#10b981" />
          </div>
          <h2>Ready to start capturing data?</h2>
          <p>Secure, validated, and field-tested. Begin a new beneficiary intake record now.</p>
          <button className="btn-hero-primary" onClick={onStart}>
            {t.hero.cta}
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-logo">
            <div className="landing-logo-icon"><Icon name="shield-plus" size={20} /></div>
            <div className="landing-logo-text">
              <span className="landing-logo-main">BHF</span>
              <span className="landing-logo-sub">DataGuardian</span>
            </div>
          </div>
          <p className="footer-tagline">{t.footer.tagline}</p>
          <p className="footer-rights">{t.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
import { useState } from "react";
import Icon from "./Icon";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ROLES = ["Field Volunteer","Health Worker","Program Manager","Data Analyst","Administrator"];

const i18n = {
  en: {
    welcome: "Welcome Back",
    sub: "Sign in to access BHF DataGuardian",
    email: "Email Address", password: "Password",
    btn: "Sign In", loading: "Signing in...",
    noAccount: "Don't have an account?", register: "Register",
    backHome: "Back to Home",
    // register form
    regTitle: "Create Account",
    regSub: "Register to join BHF DataGuardian",
    fullName: "Full Name", role: "Your Role",
    regBtn: "Create Account", regLoading: "Creating...",
    hasAccount: "Already have an account?", login: "Sign In",
  },
};

const t = (lang) => i18n[lang] || i18n.en;

export default function LoginPage({ onSuccess, onBack, lang }) {
  const { login } = useAuth();
  const tx = t(lang);

  const [mode,    setMode]    = useState("login");   // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // login fields
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");

  // register extras
  const [fullName, setFullName] = useState("");
  const [role,     setRole]     = useState("Field Volunteer");
  const [showPw,   setShowPw]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data);          // store in context + localStorage
      onSuccess(data);      // tell App to open the form
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { registerUser } = await import("../services/api");
      const data = await registerUser({ fullName, email, password, role });
      login(data);
      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* bg decoration */}
      <div className="login-bg-glow"></div>
      <div className="login-bg-grid"></div>

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="landing-logo-icon">
            <Icon name="shield-plus" size={22} />
          </div>
          <div className="landing-logo-text">
            <span className="landing-logo-main">BHF</span>
            <span className="landing-logo-sub">DataGuardian</span>
          </div>
        </div>

        <h2 className="login-title">
          {mode === "login" ? tx.welcome : tx.regTitle}
        </h2>
        <p className="login-sub">
          {mode === "login" ? tx.sub : tx.regSub}
        </p>

        {error && (
          <div className="login-error">
            <Icon name="x" size={14} />
            {error}
          </div>
        )}

        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="login-form">

          {/* Full Name — register only */}
          {mode === "register" && (
            <div className="input-group">
              <label htmlFor="fullName">{tx.fullName}</label>
              <div className="input-wrapper">
                <Icon name="user" size={18} className="input-icon" />
                <input
                  type="text" id="fullName"
                  placeholder="e.g. Halima Musa"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="input-group">
            <label htmlFor="login-email">{tx.email}</label>
            <div className="input-wrapper">
              <Icon name="mail" size={18} className="input-icon" />
              <input
                type="email" id="login-email"
                placeholder="you@bhf.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="login-pw">{tx.password}</label>
            <div className="input-wrapper">
              <Icon name="lock" size={18} className="input-icon" />
              <input
                type={showPw ? "text" : "password"}
                id="login-pw"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: "3rem" }}
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw((p) => !p)}
              >
                <Icon name={showPw ? "eye-off" : "eye"} size={16} />
              </button>
            </div>
          </div>

          {/* Role — register only */}
          {mode === "register" && (
            <div className="input-group">
              <label htmlFor="reg-role">{tx.role}</label>
              <div className="input-wrapper">
                <Icon name="badge-check" size={18} className="input-icon" />
                <select
                  id="reg-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <Icon name="chevron-down" size={16} className="select-arrow" />
              </div>
            </div>
          )}

          {/* Role badge shown on login */}
          {mode === "login" && (
            <div className="login-role-hint">
              <Icon name="shield-check" size={13} color="#10b981" />
              Role-based access — your permissions are set by your account.
            </div>
          )}

          <button type="submit" className="btn btn-success login-btn" disabled={loading}>
            {loading
              ? <><span className="login-spinner"></span>{mode === "login" ? tx.loading : tx.regLoading}</>
              : <>{mode === "login" ? tx.btn : tx.regBtn} <Icon name="arrow-right" size={16} /></>
            }
          </button>
        </form>

        {/* Toggle mode */}
        <p className="login-toggle">
          {mode === "login" ? tx.noAccount : tx.hasAccount}{" "}
          <button
            className="login-toggle-btn"
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          >
            {mode === "login" ? tx.register : tx.login}
          </button>
        </p>

        {/* Back */}
        <button className="back-to-home" style={{ margin: "0.5rem auto 0", display: "flex" }} onClick={onBack}>
          <Icon name="arrow-left" size={14} />
          {tx.backHome}
        </button>
      </div>
    </div>
  );
}
import Icon from "./Icon";

const LANGUAGES = [
  { code: "en", label: "English" }, { code: "ha", label: "Hausa" },
  { code: "yo", label: "Yoruba" },  { code: "ig", label: "Igbo" },
  { code: "fr", label: "Français" },{ code: "ar", label: "العربية" },
];

const stepLabels = {
  en: [{ title: "Beneficiary Profile", desc: "Personal & contact details" }, { title: "Health Screening", desc: "BP, blood sugar & BMI" }],
  ha: [{ title: "Bayanan Amfani", desc: "Sunan mutum da lambar wayar" }, { title: "Gwajin Lafiya", desc: "BP, sukari da BMI" }],
  yo: [{ title: "Alaye Oluranlọwọ", desc: "Ẹsẹ ati alaye ibasọrọ" }, { title: "Ayẹwo Ilera", desc: "BP, suga ẹjẹ & BMI" }],
  ig: [{ title: "Ozi Onye Ọrụ", desc: "Nkọwa onwe & nọmba ekwentị" }, { title: "Nlele Ahụike", desc: "BP, shuga ọbara & BMI" }],
  fr: [{ title: "Profil Bénéficiaire", desc: "Informations personnelles" }, { title: "Bilan de Santé", desc: "TA, glycémie & IMC" }],
  ar: [{ title: "ملف المستفيد", desc: "التفاصيل الشخصية والتواصل" }, { title: "الفحص الصحي", desc: "ضغط الدم، السكر، ومؤشر كتلة الجسم" }],
};

const langLabels = { en: "Language", ha: "Harshe", yo: "Èdè", ig: "Asụsụ", fr: "Langue", ar: "اللغة" };
const secureLabels = { en: "Secure & encrypted", ha: "Tsaro & sirri", yo: "Aabo & fifi pamọ", ig: "Nchekwa & ezipụta", fr: "Sécurisé & chiffré", ar: "آمن ومشفر" };

function Sidebar({ currentStep, setCurrentStep, lang, setLang, sidebarOpen, setSidebarOpen, onBackToHome }) {
  const steps = stepLabels[lang] || stepLabels.en;
  const isRTL = lang === "ar";

  return (
    <aside className={`sidebar${sidebarOpen ? " open" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
      <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
        <Icon name="x" size={18} />
      </button>
      <div className="logo">
        <Icon name="shield-plus" size={22} className="logo-icon" />
        <span>BHF</span>
      </div>
      <div className="logo-sub">
        <p>Beyond Health Foundation</p>
        <span className="app-name">DataGuardian</span>
      </div>
      <div className="progress-steps">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          return (
            <div key={stepNumber} className={`step${currentStep === stepNumber ? " active" : ""}${currentStep > stepNumber ? " completed" : ""}`} data-step={stepNumber} onClick={() => setCurrentStep(stepNumber)}>
              <div className="step-number">
                {currentStep > stepNumber ? <Icon name="check" size={14} /> : stepNumber}
              </div>
              <div className="step-info">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="lang-toggle">
        <p className="lang-label">
          <Icon name="globe" size={12} style={{ display: "inline", marginRight: 4 }} />
          {langLabels[lang] || "Language"}
        </p>
        <div className="input-wrapper" style={{ marginTop: "0.4rem" }}>
          <Icon name="chevron-down" size={14} className="select-arrow" />
          <select className="lang-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </div>
      <button className="sidebar-home-btn" onClick={onBackToHome}>
        <Icon name="house" size={15} />
        {lang === "ar" ? "الرئيسية" : lang === "fr" ? "Accueil" : lang === "ha" ? "Gida" : lang === "yo" ? "Ile" : lang === "ig" ? "Ulo" : "Back to Home"}
      </button>
      <div className="sidebar-footer">
        <p>{secureLabels[lang] || secureLabels.en}</p>
        <div className="security-badges">
          <Icon name="shield-check" size={16} className="badge-icon" />
          <Icon name="lock" size={16} className="badge-icon" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
import Icon from "./Icon";

const t = {
  en: {
    title: "Beneficiary Profile",
    firstName: "First Name", lastName: "Last Name", gender: "Gender",
    genderOptions: ["Select gender", "Male", "Female", "Prefer not to say"],
    age: "Age", phone: "Phone Number", address: "Community / Address",
    volunteerName: "Volunteer / Recorder Name",
    placeholders: { firstName: "e.g. Amina", lastName: "e.g. Musa", age: "e.g. 34", phone: "+234 800 000 0000", address: "Ward, LGA, State", volunteerName: "Full name of recorder" },
  },
  ha: {
    title: "Bayanan Amfani",
    firstName: "Suna", lastName: "Sunan Iyali", gender: "Jinsi",
    genderOptions: ["Zaɓi jinsi", "Namiji", "Mace", "Ba zan bayyana ba"],
    age: "Shekaru", phone: "Lambar Waya", address: "Gari / Unguwa",
    volunteerName: "Sunan Mai Yin Rikodin",
    placeholders: { firstName: "misali: Amina", lastName: "misali: Musa", age: "misali: 34", phone: "+234 800 000 0000", address: "Unguwa, LGA, Jiha", volunteerName: "Cikakken suna" },
  },
};

function Step1({ formData, setFormData, lang }) {
  const i18n = t[lang] || t.en;
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <section className="form-section active" id="step1">
      <h2 className="section-title">
        <Icon name="user-round" size={20} />
        {i18n.title}
      </h2>
      <div className="form-grid">
        <div className="input-group">
          <label htmlFor="firstName">{i18n.firstName}</label>
          <div className="input-wrapper">
            <Icon name="user" size={16} className="input-icon" />
            <input type="text" id="firstName" name="firstName" placeholder={i18n.placeholders.firstName} value={formData.firstName} onChange={handleChange} required />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="lastName">{i18n.lastName}</label>
          <div className="input-wrapper">
            <Icon name="user" size={16} className="input-icon" />
            <input type="text" id="lastName" name="lastName" placeholder={i18n.placeholders.lastName} value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="gender">{i18n.gender}</label>
          <div className="input-wrapper">
            <Icon name="users" size={16} className="input-icon" />
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
              {i18n.genderOptions.map((opt, i) => (
                <option key={i} value={i === 0 ? "" : opt.toLowerCase()} disabled={i === 0}>{opt}</option>
              ))}
            </select>
            <Icon name="chevron-down" size={14} className="select-arrow" />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="age">{i18n.age}</label>
          <div className="input-wrapper">
            <Icon name="calendar" size={16} className="input-icon" />
            <input type="number" id="age" name="age" placeholder={i18n.placeholders.age} min="1" max="120" value={formData.age} onChange={handleChange} required />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="phone">{i18n.phone}</label>
          <div className="input-wrapper">
            <Icon name="phone" size={16} className="input-icon" />
            <input type="tel" id="phone" name="phone" placeholder={i18n.placeholders.phone} value={formData.phone} onChange={handleChange} />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="address">{i18n.address}</label>
          <div className="input-wrapper">
            <Icon name="map-pin" size={16} className="input-icon" />
            <input type="text" id="address" name="address" placeholder={i18n.placeholders.address} value={formData.address} onChange={handleChange} />
          </div>
        </div>
        <div className="input-group full-width">
          <label htmlFor="volunteerName">{i18n.volunteerName}</label>
          <div className="input-wrapper">
            <Icon name="badge-check" size={16} className="input-icon" />
            <input type="text" id="volunteerName" name="volunteerName" placeholder={i18n.placeholders.volunteerName} value={formData.volunteerName} onChange={handleChange} required />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Step1;
import { useState } from "react";
import Icon from "./Icon";

const t = {
  en: {
    title: "Health Screening Metrics",
    bp: "Blood Pressure (mmHg)", bpSystolic: "Systolic", bpDiastolic: "Diastolic",
    bloodSugar: "Blood Sugar (mg/dL)", weight: "Weight (kg)", height: "Height (cm)",
    bmi: "BMI (auto-calculated)", conditions: "Known Conditions (add & press Enter)",
    conditionPlaceholder: "e.g. Hypertension, Diabetes...",
    bmiNote: "BMI is calculated automatically from weight and height.",
  },
  ha: {
    title: "Bayanan Gwajin Lafiya",
    bp: "Matsayin Jini (mmHg)", bpSystolic: "Sama", bpDiastolic: "Kasa",
    bloodSugar: "Sukari a Jini (mg/dL)", weight: "Nauyi (kg)", height: "Tsawo (cm)",
    bmi: "BMI (an lissafa kai tsaye)", conditions: "Cututtuka da aka sani (Rubuta & danna Enter)",
    conditionPlaceholder: "misali: Hauwa'u Jini, Ciwon Sukari...",
    bmiNote: "BMI yana lissafawa ta atomatik daga nauyi da tsawo.",
  },
};

function Step2({ formData, setFormData, conditions, setConditions, lang }) {
  const i18n = t[lang] || t.en;
  const [condInput, setCondInput] = useState("");

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    const w = parseFloat(e.target.name === "weight" ? e.target.value : updated.weight);
    const h = parseFloat(e.target.name === "height" ? e.target.value : updated.height) / 100;
    updated.bmi = (w && h) ? (w / (h * h)).toFixed(1) : "";
    setFormData(updated);
  };

  const handleCondKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = condInput.trim();
      if (val && !conditions.includes(val)) setConditions([...conditions, val]);
      setCondInput("");
    }
  };

  const removeCondition = (c) => setConditions(conditions.filter((x) => x !== c));

  const getBmiCategory = (bmi) => {
    if (!bmi) return "";
    const b = parseFloat(bmi);
    if (b < 18.5) return lang === "ha" ? "Ƙarancin Nauyi" : "Underweight";
    if (b < 25)   return lang === "ha" ? "Al'ada" : "Normal";
    if (b < 30)   return lang === "ha" ? "Yawan Nauyi" : "Overweight";
    return lang === "ha" ? "Kiba" : "Obese";
  };

  const bmiCategory = getBmiCategory(formData.bmi);
  const bmiColor = !formData.bmi ? "" : parseFloat(formData.bmi) < 18.5 ? "#f59e0b" : parseFloat(formData.bmi) < 25 ? "#10b981" : parseFloat(formData.bmi) < 30 ? "#f59e0b" : "#ef4444";

  return (
    <section className="form-section active" id="step2">
      <h2 className="section-title">
        <Icon name="heart-pulse" size={20} />
        {i18n.title}
      </h2>
      <div className="form-grid">
        <div className="input-group">
          <label>{i18n.bp}</label>
          <div className="bp-row">
            <div className="input-wrapper">
              <Icon name="activity" size={16} className="input-icon" />
              <input type="number" id="bloodPressureSystolic" name="bloodPressureSystolic" placeholder={i18n.bpSystolic} value={formData.bloodPressureSystolic} onChange={handleChange} min="60" max="250" />
            </div>
            <span className="bp-slash">/</span>
            <div className="input-wrapper">
              <input type="number" id="bloodPressureDiastolic" name="bloodPressureDiastolic" placeholder={i18n.bpDiastolic} value={formData.bloodPressureDiastolic} onChange={handleChange} min="40" max="150" />
            </div>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="bloodSugar">{i18n.bloodSugar}</label>
          <div className="input-wrapper">
            <Icon name="droplets" size={16} className="input-icon" />
            <input type="number" id="bloodSugar" name="bloodSugar" placeholder="e.g. 95" value={formData.bloodSugar} onChange={handleChange} min="0" />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="weight">{i18n.weight}</label>
          <div className="input-wrapper">
            <Icon name="scale" size={16} className="input-icon" />
            <input type="number" id="weight" name="weight" placeholder="e.g. 70" value={formData.weight} onChange={handleChange} min="1" />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="height">{i18n.height}</label>
          <div className="input-wrapper">
            <Icon name="ruler" size={16} className="input-icon" />
            <input type="number" id="height" name="height" placeholder="e.g. 165" value={formData.height} onChange={handleChange} min="1" />
          </div>
        </div>
        <div className="input-group full-width">
          <label htmlFor="bmi">{i18n.bmi}</label>
          <div className="bmi-display">
            <div className="input-wrapper">
              <Icon name="calculator" size={16} className="input-icon" />
              <input type="text" id="bmi" name="bmi" value={formData.bmi} readOnly placeholder="—" style={{ color: bmiColor || "inherit" }} />
            </div>
            {bmiCategory && <span className="bmi-badge" style={{ background: bmiColor }}>{bmiCategory}</span>}
          </div>
          <p className="field-hint">{i18n.bmiNote}</p>
        </div>
        <div className="input-group full-width">
          <label>{i18n.conditions}</label>
          <div className="tags-input-container" id="skillsContainer">
            <div className="tags-list" id="tagsList">
              {conditions.map((c) => (
                <span key={c} className="tag">
                  {c}
                  <button type="button" className="tag-remove" onClick={() => removeCondition(c)}>&times;</button>
                </span>
              ))}
            </div>
            <input type="text" id="skillInput" placeholder={i18n.conditionPlaceholder} className="tags-input" value={condInput} onChange={(e) => setCondInput(e.target.value)} onKeyDown={handleCondKey} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Step2;
import Icon from "./Icon";

const text = {
  en: { heading: "Record Submitted Successfully!", body: "The beneficiary's data has been securely encrypted and stored.", btn: "Add New Beneficiary" },
  ha: { heading: "An Aika Bayani Cikin Nasara!", body: "An adana bayanin amfani cikin tsaro da sirri.", btn: "Ƙara Sabon Amfani" },
  yo: { heading: "Igbasilẹ Ti Firanṣẹ!", body: "Data oluranlọwọ ti wa ni fipamọ ni aabo.", btn: "Ṣafikun Oluranlọwọ Tuntun" },
  ig: { heading: "Ezipụtara Ndekọ Nke Ọma!", body: "Edeturu data onye ọrụ nchekwa.", btn: "Tinye Onye Ọrụ Ọhụrụ" },
  fr: { heading: "Dossier Soumis avec Succès !", body: "Les données du bénéficiaire ont été chiffrées et enregistrées.", btn: "Ajouter un Nouveau Bénéficiaire" },
  ar: { heading: "تم إرسال السجل بنجاح!", body: "تم تشفير بيانات المستفيد وتخزينها بأمان.", btn: "إضافة مستفيد جديد" },
};

function Success({ setSubmitted, lang }) {
  const t = text[lang] || text.en;
  const isRTL = lang === "ar";

  return (
    <div className="success-message" id="successMessage" dir={isRTL ? "rtl" : "ltr"}>
      <div className="success-icon">
        <Icon name="check-circle-2" size={48} className="check-icon" />
      </div>
      <div className="success-brand">
        <Icon name="shield-plus" size={18} color="#10b981" />
        <span>BHF DataGuardian</span>
      </div>
      <h2>{t.heading}</h2>
      <p>{t.body}</p>
      <button type="button" className="btn btn-primary" onClick={() => setSubmitted(false)}>
        {t.btn}
      </button>
    </div>
  );
}

export default Success;
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);   // { _id, fullName, email, role, token }
  const [ready, setReady] = useState(false);  // hydrated from localStorage?

  // ── Rehydrate on mount ───────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bhf_user");
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {}
    setReady(true);
  }, []);

  // ── Persist whenever user changes ────────────────────────
  useEffect(() => {
    if (!ready) return;
    if (user) localStorage.setItem("bhf_user", JSON.stringify(user));
    else      localStorage.removeItem("bhf_user");
  }, [user, ready]);

  const login  = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
// ─────────────────────────────────────────────────────────────
//  BHF DataGuardian — API Service Layer
//  Base URL from Vite env: VITE_API_URL  (default: localhost:3000)
// ─────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

// ── AUTH ─────────────────────────────────────────────────────

export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const registerUser = async ({ fullName, email, password, role }) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password, role }),
  });
  return handleResponse(res);
};

// ── BENEFICIARY RECORDS ───────────────────────────────────────
// Hits POST /api/records — add this route to your Express backend

export const submitRecord = async (token, payload) => {
  const res = await fetch(`${BASE_URL}/api/records`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

// ── ADMIN ─────────────────────────────────────────────────────

export const getUsers = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
};

export const deleteUser = async (token, userId) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse(res);
};

export const updateUserRole = async (token, userId, role) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${userId}/role`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ role }),
  });
  return handleResponse(res);
};
import { useState } from "react";
import Icon from "./components/Icon";
import LandingPage  from "./components/LandingPage";
import LoginPage    from "./components/LoginPage";
import Sidebar      from "./components/Sidebar";
import Step1        from "./components/Step1";
import Step2        from "./components/Step2";
import Success      from "./components/Success";
import { useAuth }  from "./context/AuthContext";
import { submitRecord } from "./services/api";
import "./App.css";

// ── i18n ─────────────────────────────────────────────────────
const headerText = {
  en: { badge: "DataGuardian", title: "Beneficiary Intake Form",     sub: "Beyond Health Foundation — Secure, encrypted data collection for community health programs." },
  ha: { badge: "DataGuardian", title: "Fom na Amfanin Masu Amfani",  sub: "Gidauniyar Lafiya ta BHF — Tattara bayanai lafiya da sirri." },
  yo: { badge: "DataGuardian", title: "Fọọmu Gbigba Oluranlọwọ",     sub: "BHF — Gbigba data ti o ni aabo fun awọn eto ilera agbegbe." },
  ig: { badge: "DataGuardian", title: "Ụdị Natarị Onye Ọrụ",         sub: "BHF — Nchịkọta data nchekwa maka mmemme ahụike obodo." },
  fr: { badge: "DataGuardian", title: "Formulaire d'Admission",       sub: "BHF — Collecte de données sécurisée pour les programmes de santé communautaire." },
  ar: { badge: "DataGuardian", title: "استمارة قبول المستفيد",        sub: "مؤسسة BHF — جمع بيانات آمن ومشفر لبرامج الصحة المجتمعية." },
};
const navText = {
  en: { next: "Next Step",         prev: "Previous",   submit: "Submit Record",    home: "Home",    logout: "Logout" },
  ha: { next: "Mataki na Gaba",    prev: "Baya",        submit: "Aika Bayani",      home: "Gida",    logout: "Fita" },
  yo: { next: "Igbesẹ Ti o Tẹle",  prev: "Iṣaaju",     submit: "Firanṣẹ Igbasilẹ", home: "Ile",     logout: "Jade" },
  ig: { next: "Nzọụkwụ Ọzọ",       prev: "Nazaghachi",  submit: "Zipu Ndekọ",       home: "Ulo",     logout: "Pụọ" },
  fr: { next: "Étape Suivante",     prev: "Précédent",   submit: "Soumettre",        home: "Accueil", logout: "Déconnexion" },
  ar: { next: "الخطوة التالية",     prev: "السابق",      submit: "إرسال السجل",       home: "الرئيسية",logout: "خروج" },
};

const emptyForm = {
  firstName: "", lastName: "", gender: "", age: "",
  phone: "", address: "", volunteerName: "",
  bloodPressureSystolic: "", bloodPressureDiastolic: "",
  bloodSugar: "", weight: "", height: "", bmi: "",
  consent: false,
};

// ── App ───────────────────────────────────────────────────────
// views: "landing" | "login" | "form" | "success"
export default function App() {
  const { user, logout, ready } = useAuth();

  const [view,        setView]        = useState("landing");
  const [currentStep, setCurrentStep] = useState(1);
  const [conditions,  setConditions]  = useState([]);
  const [lang,        setLang]        = useState("en");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData,    setFormData]    = useState(emptyForm);
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!ready) return null; // wait for localStorage hydration

  const h     = headerText[lang] || headerText.en;
  const n     = navText[lang]    || navText.en;
  const isRTL = lang === "ar";

  // ── helpers ───────────────────────────────────────────────
  const goToLogin = () => { setView("login"); window.scrollTo({ top: 0 }); };

  const onLoginSuccess = () => {
    setView("form");
    setCurrentStep(1);
    window.scrollTo({ top: 0 });
  };

  const resetAll = () => {
    setView("landing");
    setCurrentStep(1);
    setConditions([]);
    setFormData(emptyForm);
    setSubmitError("");
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  };

  const handleLogout = () => { logout(); resetAll(); };

  const nextStep = () => { setCurrentStep(2); setSidebarOpen(false); };
  const prevStep = () => { setCurrentStep(1); setSidebarOpen(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        conditions,
        lang,
        submittedBy: user?._id,
        submittedAt: new Date().toISOString(),
      };
      await submitRecord(user?.token, payload);
      setView("success");
      window.scrollTo({ top: 0 });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  //  LANDING
  // ─────────────────────────────────────────────────────────
  if (view === "landing") {
    return (
      <LandingPage
        onStart={user ? onLoginSuccess : goToLogin}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  // ─────────────────────────────────────────────────────────
  //  LOGIN / REGISTER
  // ─────────────────────────────────────────────────────────
  if (view === "login") {
    return (
      <LoginPage
        onSuccess={onLoginSuccess}
        onBack={resetAll}
        lang={lang}
      />
    );
  }

  // ─────────────────────────────────────────────────────────
  //  SUCCESS
  // ─────────────────────────────────────────────────────────
  if (view === "success") {
    return <Success setSubmitted={resetAll} lang={lang} />;
  }

  // ─────────────────────────────────────────────────────────
  //  FORM
  // ─────────────────────────────────────────────────────────
  return (
    <div className="container" dir={isRTL ? "rtl" : "ltr"}>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        currentStep={currentStep}
        setCurrentStep={(s) => { setCurrentStep(s); setSidebarOpen(false); }}
        lang={lang}
        setLang={setLang}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onBackToHome={resetAll}
      />

      <main className="main-content">

        {/* Mobile topbar */}
        <div className="mobile-topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            <Icon name="menu" size={20} />
          </button>
          <span className="mobile-brand">
            <Icon name="shield-plus" size={16} />
            BHF DataGuardian
          </span>
          <span className="mobile-step">{currentStep}/2</span>
        </div>

        {/* Top action row */}
        <div className="form-top-row">
          <button className="back-to-home" onClick={resetAll}>
            <Icon name="arrow-left" size={15} />
            {n.home}
          </button>

          {/* User chip + logout */}
          {user && (
            <div className="user-chip">
              <div className="user-chip-avatar">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="user-chip-info">
                <span className="user-chip-name">{user.fullName}</span>
                <span className="user-chip-role">{user.role}</span>
              </div>
              <button className="user-chip-logout" onClick={handleLogout} title={n.logout}>
                <Icon name="log-out" size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Header */}
        <header className="form-header">
          <div className="header-badge">{h.badge}</div>
          <h1>{h.title}</h1>
          <p className="subtitle">{h.sub}</p>
        </header>

        {/* Form */}
        <form className="form-container" id="dataForm" onSubmit={handleSubmit}>

          {currentStep === 1 && (
            <Step1 formData={formData} setFormData={setFormData} lang={lang} />
          )}
          {currentStep === 2 && (
            <Step2
              formData={formData}
              setFormData={setFormData}
              conditions={conditions}
              setConditions={setConditions}
              lang={lang}
            />
          )}

          {/* API error */}
          {submitError && (
            <div className="submit-error">
              <Icon name="x" size={14} />
              {submitError}
            </div>
          )}

          {/* Navigation */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" className="btn btn-secondary" onClick={prevStep}>
                <Icon name="arrow-left" size={18} className="btn-icon" />
                {n.prev}
              </button>
            )}
            {currentStep === 1 && (
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                {n.next}
                <Icon name="arrow-right" size={18} className="btn-icon" />
              </button>
            )}
            {currentStep === 2 && (
              <button type="submit" className="btn btn-success" disabled={submitting}>
                {submitting
                  ? <><span className="login-spinner"></span>Saving...</>
                  : <>{n.submit} <Icon name="check" size={18} className="btn-icon" /></>
                }
              </button>
            )}
          </div>

        </form>
      </main>
    </div>
  );
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-blue: #2563eb;
  --primary-blue-hover: #1d4ed8;
  --primary-blue-light: #3b82f6;
  --dark-bg: #0a0a0a;
  --dark-card: #111111;
  --dark-border: #1f2937;
  --dark-input: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --success: #10b981;
  --error: #ef4444;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
  font-family: "Inter", sans-serif;
  background-color: var(--dark-bg);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
}

.container {
  display: flex;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--dark-bg);
}

/* Sidebar Styles */
.sidebar {
  width: 320px;
  background: var(--dark-card);
  border-right: 1px solid var(--dark-border);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 3rem;
}

.logo-icon {
  color: var(--primary-blue);
  width: 28px;
  height: 28px;
}

.progress-steps {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  opacity: 0.5;
  transition: var(--transition);
  cursor: pointer;
}

.step.active {
  opacity: 1;
}

.step.completed {
  opacity: 1;
}

.step.completed .step-number {
  background: var(--success);
  border-color: var(--success);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--dark-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: var(--transition);
  flex-shrink: 0;
}

.step.active .step-number {
  border-color: var(--primary-blue);
  background: var(--primary-blue);
  color: white;
}

.step-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.step-info p {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid var(--dark-border);
  text-align: center;
}

.sidebar-footer p {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.security-badges {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.badge-icon {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
}

/* Main Content Styles */
.main-content {
  flex: 1;
  margin-left: 320px;
  padding: 3rem 4rem;
  max-width: 900px;
}

.form-header {
  margin-bottom: 2.5rem;
}

.form-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(
    135deg,
    var(--text-primary) 0%,
    var(--primary-blue-light) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

/* Form Styles */
.form-container {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 1rem;
  padding: 2rem;
}

.form-section {
  display: none;
  animation: fadeIn 0.4s ease-in-out;
}

.form-section.active {
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  pointer-events: none;
  z-index: 2;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.input-group input,
.input-group select,
.input-group textarea {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: var(--dark-input);
  border: 1px solid var(--dark-border);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-family: inherit;
  transition: var(--transition);
}

.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-group input::placeholder,
.input-group textarea::placeholder {
  color: var(--text-muted);
}

.input-group select {
  appearance: none;
  cursor: pointer;
  padding-right: 2.5rem;
}

.input-group select option {
  background: var(--dark-card);
  color: var(--text-primary);
}

.textarea-wrapper textarea {
  padding-left: 1rem;
  padding-top: 0.75rem;
  min-height: 120px;
  resize: vertical;
}

.textarea-icon {
  top: 0.75rem;
  left: 1rem;
}

/* Tags Input Styles */
.tags-input-container {
  background: var(--dark-input);
  border: 1px solid var(--dark-border);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 50px;
  align-items: center;
  cursor: text;
  transition: var(--transition);
}

.tags-input-container:focus-within {
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: var(--primary-blue);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: tagIn 0.3s ease;
}

@keyframes tagIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.tag-remove {
  cursor: pointer;
  width: 14px;
  height: 14px;
  opacity: 0.8;
  transition: var(--transition);
}

.tag-remove:hover {
  opacity: 1;
  transform: scale(1.1);
}

.tags-input {
  background: transparent;
  border: none;
  color: var(--text-primary);
  flex: 1;
  min-width: 120px;
  padding: 0.25rem;
  font-size: 0.9375rem;
}

.tags-input:focus {
  outline: none;
}

/* Checkbox Styles */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-secondary);
  user-select: none;
}

.checkbox-label input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--dark-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  flex-shrink: 0;
}

.checkbox-label input:checked + .checkmark {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
}

.checkbox-label input:checked + .checkmark::after {
  content: "";
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-top: -2px;
}

.checkbox-text {
  line-height: 1.4;
}

.link {
  color: var(--primary-blue);
  text-decoration: none;
  transition: var(--transition);
}

.link:hover {
  color: var(--primary-blue-light);
  text-decoration: underline;
}

/* Button Styles */
.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--dark-border);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: var(--transition);
  font-family: inherit;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  background: var(--primary-blue-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 12px -2px rgba(37, 99, 235, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--dark-border);
}

.btn-secondary:hover {
  background: var(--dark-input);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.btn-success {
  background: var(--success);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
}

.btn-success:hover {
  background: #059669;
  transform: translateY(-1px);
}
.success-message {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 1rem;
  animation: fadeIn 0.5s ease;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  border: 2px solid var(--success);
}

.check-icon {
  width: 40px;
  height: 40px;
  color: var(--success);
}

.success-message h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.success-message p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    padding: 2rem;
    max-width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 1.5rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .btn {
    width: 100%;
  }

  .form-navigation {
    flex-direction: column-reverse;
    gap: 1rem;
  }
}

/* Focus visible for accessibility */
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
button:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--dark-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--dark-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* ============================================
   BHF DataGuardian — Extended Styles
   ============================================ */

/* Override logo icon color to health green */
.logo-icon {
  color: #10b981;
  width: 28px;
  height: 28px;
}

/* Brand subtitle below logo */
.logo-sub {
  margin-bottom: 2rem;
  margin-top: -2rem;
}

.logo-sub p {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.15rem;
}

.logo-sub .app-name {
  font-size: 0.75rem;
  color: var(--primary-blue-light);
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* Header badge */
.header-badge {
  display: inline-block;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 999px;
  padding: 0.2rem 0.8rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

/* Language toggle in sidebar */
.lang-toggle {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--dark-border);
  border-radius: 0.5rem;
}

.lang-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.lang-buttons {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  flex: 1;
  padding: 0.4rem 0.5rem;
  background: transparent;
  border: 1px solid var(--dark-border);
  border-radius: 0.375rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.lang-btn:hover {
  background: var(--dark-input);
  color: var(--text-primary);
}

.lang-btn.lang-active {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
  color: white;
  font-weight: 600;
}

/* Section title icon alignment */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

/* Blood pressure dual input row */
.bp-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bp-row .input-wrapper {
  flex: 1;
}

.bp-slash {
  font-size: 1.25rem;
  color: var(--text-muted);
  font-weight: 300;
  flex-shrink: 0;
}

/* BMI auto-calc display */
.bmi-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bmi-display .input-wrapper {
  flex: 1;
}

.bmi-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  flex-shrink: 0;
  transition: var(--transition);
}

/* Field hint text */
.field-hint {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.3rem;
  font-style: italic;
}

/* BMI input readonly look */
input[readonly] {
  opacity: 0.9;
  cursor: default;
  font-weight: 600;
}

/* Success page brand line */
.success-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Language select dropdown in sidebar */
.lang-select {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  background: var(--dark-input);
  border: 1px solid var(--dark-border);
  border-radius: 0.375rem;
  color: var(--text-primary);
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  transition: var(--transition);
}

.lang-select:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.lang-select option {
  background: var(--dark-card);
  color: var(--text-primary);
}

/* ============================================
   Mobile Sidebar Toggle & Topbar
   ============================================ */

/* Sidebar close button — hidden on desktop */
.sidebar-close {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: 1px solid var(--dark-border);
  border-radius: 0.375rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.3rem;
  line-height: 0;
  transition: var(--transition);
}

.sidebar-close:hover {
  background: var(--dark-input);
  color: var(--text-primary);
}

.sidebar-close i {
  width: 18px;
  height: 18px;
}

/* Dark overlay behind open sidebar */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99;
  backdrop-filter: blur(2px);
}

/* Mobile top bar — hidden on desktop */
.mobile-topbar {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background: var(--dark-card);
  border-bottom: 1px solid var(--dark-border);
  margin-bottom: 1.5rem;
  border-radius: 0.75rem;
  gap: 0.75rem;
}

.hamburger {
  background: transparent;
  border: 1px solid var(--dark-border);
  border-radius: 0.375rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.35rem;
  line-height: 0;
  transition: var(--transition);
  flex-shrink: 0;
}

.hamburger:hover {
  background: var(--dark-input);
  color: var(--text-primary);
}

.hamburger i {
  width: 20px;
  height: 20px;
  display: block;
}

.mobile-brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}

.mobile-step {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary-blue-light);
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  flex-shrink: 0;
}

/* ============================================
   Responsive overrides
   ============================================ */
@media (max-width: 1024px) {
  /* Sidebar slides in from left, overlaying content */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  /* Show overlay when sidebar is open */
  .sidebar.open ~ * .sidebar-overlay,
  .sidebar-overlay {
    display: block;
  }

  .sidebar-close {
    display: flex;
  }

  .main-content {
    margin-left: 0;
    padding: 1.5rem;
    max-width: 100%;
  }

  .mobile-topbar {
    display: flex;
  }

  .form-header {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 1rem;
  }

  .form-container {
    padding: 1.25rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .input-group.full-width {
    grid-column: 1;
  }

  .form-header h1 {
    font-size: 1.4rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .form-navigation {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }

  .bmi-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .bp-row {
    flex-wrap: nowrap;
  }

  .mobile-topbar {
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
}

/* ============================================
   LANDING PAGE STYLES
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

.landing {
  min-height: 100vh;
  background: var(--dark-bg);
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
}

/* ── NAV ─────────────────────────────── */
.landing-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--dark-border);
}

.landing-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.landing-logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  flex-shrink: 0;
}

.landing-logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #0d9488, #10b981);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.35);
}

.landing-logo-icon i { width: 18px; height: 18px; }

.landing-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.landing-logo-main {
  font-family: 'Sora', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.landing-logo-sub {
  font-size: 0.65rem;
  color: #10b981;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.landing-nav-links {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.nav-link {
  padding: 0.4rem 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: var(--transition);
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255,255,255,0.05);
}

.landing-nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.lang-pills {
  display: flex;
  gap: 0.25rem;
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 0.5rem;
  padding: 0.2rem;
}

.lang-pill {
  padding: 0.25rem 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.lang-pill:hover { color: var(--text-primary); }

.lang-pill.active {
  background: var(--primary-blue);
  color: white;
}

.btn-nav-cta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.125rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
  white-space: nowrap;
}

.btn-nav-cta:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

/* ── HERO ─────────────────────────────── */
.landing-hero {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 2rem 4rem;
  gap: 4rem;
  overflow: hidden;
}

.hero-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(16, 185, 129, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.hero-bg-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  flex: 1;
  position: relative;
  z-index: 2;
  animation: heroFadeUp 0.7s ease both;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #10b981;
  border-radius: 999px;
  padding: 0.35rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 1.75rem;
}

.hero-title {
  font-family: 'Sora', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
}

.hero-title-line1 {
  display: block;
  color: var(--text-primary);
}

.hero-title-line2 {
  display: block;
  background: linear-gradient(135deg, #10b981 0%, #0d9488 50%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 1.0625rem;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 0.625rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(16, 185, 129, 0.4);
}

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.875rem 1.5rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--dark-border);
  border-radius: 0.625rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition);
  font-family: 'DM Sans', sans-serif;
}

.btn-hero-secondary:hover {
  background: var(--dark-card);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

/* Hero floating card */
.hero-visual {
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  animation: heroFadeUp 0.7s 0.2s ease both;
}

.hero-card {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 1rem;
  padding: 1.25rem;
  width: 300px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.08);
}

.hero-card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.hero-card-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
}
.hero-card-dot.green  { background: #10b981; }
.hero-card-dot.yellow { background: #f59e0b; }
.hero-card-dot.red    { background: #ef4444; }

.hero-card-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-left: 0.25rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.hero-card-rows { display: flex; flex-direction: column; gap: 0.875rem; }

.hero-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.hero-card-row:last-child { border-bottom: none; padding-bottom: 0; }

.hcr-label { font-size: 0.8rem; color: var(--text-muted); }
.hcr-value { font-size: 0.825rem; font-weight: 600; }
.hcr-value.good { color: #10b981; }
.hcr-value.warn { color: #f59e0b; }
.hcr-value.muted { color: var(--text-secondary); }

.hero-card-footer {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--dark-border);
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* ── STATS ─────────────────────────────── */
.landing-stats {
  display: flex;
  justify-content: center;
  gap: 0;
  background: var(--dark-card);
  border-top: 1px solid var(--dark-border);
  border-bottom: 1px solid var(--dark-border);
}

.stat-item {
  flex: 1;
  max-width: 220px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  border-right: 1px solid var(--dark-border);
}
.stat-item:last-child { border-right: none; }

.stat-value {
  display: block;
  font-family: 'Sora', sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: #10b981;
  letter-spacing: -0.03em;
  margin-bottom: 0.35rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.03em;
}

/* ── FEATURES ─────────────────────────────── */
.landing-features {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-tag {
  display: inline-block;
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  color: var(--primary-blue-light);
  border-radius: 999px;
  padding: 0.25rem 0.875rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.section-title-lg {
  font-family: 'Sora', sans-serif;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 0.75rem;
}

.section-sub {
  color: var(--text-secondary);
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.feature-card {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 0.875rem;
  padding: 1.75rem;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(16,185,129,0.04), transparent);
  opacity: 0;
  transition: var(--transition);
}

.feature-card:hover {
  border-color: rgba(16, 185, 129, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.3);
}

.feature-card:hover::before { opacity: 1; }

.feature-icon {
  width: 44px;
  height: 44px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  margin-bottom: 1rem;
}

.feature-icon i { width: 20px; height: 20px; }

.feature-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.6rem;
}

.feature-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* ── HOW IT WORKS ─────────────────────────────── */
.landing-how {
  background: var(--dark-card);
  border-top: 1px solid var(--dark-border);
  border-bottom: 1px solid var(--dark-border);
  padding: 6rem 2rem;
}

.landing-how .section-header { margin-bottom: 3rem; }

.how-steps {
  display: flex;
  gap: 0;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

.how-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 1.5rem;
  position: relative;
}

.how-connector {
  position: absolute;
  top: 28px;
  right: -50%;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--dark-border), rgba(16,185,129,0.3), var(--dark-border));
  z-index: 0;
}

.how-step-num {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05));
  border: 1px solid rgba(16,185,129,0.3);
  color: #10b981;
  font-family: 'Sora', sans-serif;
  font-size: 0.875rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  position: relative;
  z-index: 1;
  letter-spacing: 0.05em;
}

.how-step-content h3 {
  font-family: 'Sora', sans-serif;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.how-step-content p {
  font-size: 0.825rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ── CTA BANNER ─────────────────────────────── */
.landing-cta-banner {
  padding: 6rem 2rem;
  text-align: center;
}

.cta-banner-inner {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.cta-banner-icons {
  width: 72px;
  height: 72px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.landing-cta-banner h2 {
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.landing-cta-banner p {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
}

/* ── FOOTER ─────────────────────────────── */
.landing-footer {
  background: var(--dark-card);
  border-top: 1px solid var(--dark-border);
  padding: 3rem 2rem;
}

.landing-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  text-align: center;
}

.footer-tagline {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.footer-rights {
  color: var(--text-muted);
  font-size: 0.75rem;
}

/* ── FORM PAGE BACK BUTTON ─────────────────────────────── */
.back-to-home {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid var(--dark-border);
  color: var(--text-muted);
  border-radius: 0.375rem;
  padding: 0.4rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: var(--transition);
  font-family: inherit;
}

.back-to-home:hover {
  background: var(--dark-input);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

/* ── SIDEBAR HOME BTN ─────────────────────────────── */
.sidebar-home-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--dark-border);
  color: var(--text-muted);
  border-radius: 0.375rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: var(--transition);
  font-family: inherit;
  width: 100%;
}

.sidebar-home-btn:hover {
  background: var(--dark-input);
  color: var(--text-primary);
}

/* ── ANIMATIONS ─────────────────────────────── */
@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── LANDING RESPONSIVE ─────────────────────────────── */
@media (max-width: 1024px) {
  .landing-hero {
    flex-direction: column;
    min-height: auto;
    padding: 4rem 1.5rem 3rem;
    gap: 3rem;
    text-align: center;
  }
  .hero-sub { margin: 0 auto 2.5rem; }
  .hero-actions { justify-content: center; }
  .hero-visual { display: none; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .landing-nav-links { display: none; }
}

@media (max-width: 768px) {
  .landing-stats {
    flex-wrap: wrap;
  }
  .stat-item {
    flex: 1 1 50%;
    max-width: 50%;
    border-right: none;
    border-bottom: 1px solid var(--dark-border);
  }
  .stat-item:nth-child(odd) { border-right: 1px solid var(--dark-border); }
  .stat-item:nth-last-child(-n+2) { border-bottom: none; }
  .features-grid { grid-template-columns: 1fr; }
  .how-steps { flex-direction: column; gap: 2rem; }
  .how-connector { display: none; }
  .lang-pills { display: none; }
  .landing-nav-inner { padding: 0 1rem; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 2rem; }
  .btn-hero-primary, .btn-hero-secondary { width: 100%; justify-content: center; }
  .hero-actions { flex-direction: column; }
  .btn-nav-cta span { display: none; }
}

/* ============================================
   ANIMATION STYLES
   ============================================ */

/* ── Hero entrance animation ── */
.hero-anim {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
.hero-anim--in {
  opacity: 1;
  transform: translateY(0);
}

/* hero-visual slides in from right */
.hero-visual.hero-anim {
  transform: translateX(32px) translateY(0);
}
.hero-visual.hero-anim--in {
  transform: translateX(0) translateY(0);
}

/* ── Hero card animated rows ── */
.hero-card--animated {
  position: relative;
  overflow: hidden;
}

.hcr--anim {
  opacity: 0;
  transform: translateX(12px);
  transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.hcr--show {
  opacity: 1;
  transform: translateX(0);
}

/* LIVE badge on hero card */
.hero-card-live {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.62rem;
  font-weight: 700;
  color: #10b981;
  letter-spacing: 0.08em;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  animation: livePulse 1.4s ease-in-out infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}

/* timestamp in card footer */
.hcf-timestamp {
  margin-left: auto;
  font-size: 0.68rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

/* ── How-steps staggered reveal ── */
.how-step--anim {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.how-step--visible {
  opacity: 1;
  transform: translateY(0);
}
/* LOGIN INFOS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-blue: #2563eb;
  --primary-blue-hover: #1d4ed8;
  --primary-blue-light: #3b82f6;
  --dark-bg: #0a0a0a;
  --dark-card: #111111;
  --dark-border: #1f2937;
  --dark-input: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --success: #10b981;
  --error: #ef4444;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
  font-family: "Inter", sans-serif;
  background-color: var(--dark-bg);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
}

.container {
  display: flex;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--dark-bg);
}

/* Sidebar Styles */
.sidebar {
  width: 320px;
  background: var(--dark-card);
  border-right: 1px solid var(--dark-border);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 3rem;
}

.logo-icon {
  color: var(--primary-blue);
  width: 28px;
  height: 28px;
}

.progress-steps {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  opacity: 0.5;
  transition: var(--transition);
  cursor: pointer;
}

.step.active {
  opacity: 1;
}

.step.completed {
  opacity: 1;
}

.step.completed .step-number {
  background: var(--success);
  border-color: var(--success);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--dark-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: var(--transition);
  flex-shrink: 0;
}

.step.active .step-number {
  border-color: var(--primary-blue);
  background: var(--primary-blue);
  color: white;
}

.step-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.step-info p {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid var(--dark-border);
  text-align: center;
}

.sidebar-footer p {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.security-badges {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.badge-icon {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
}

/* Main Content Styles */
.main-content {
  flex: 1;
  margin-left: 320px;
  padding: 3rem 4rem;
  max-width: 900px;
}

.form-header {
  margin-bottom: 2.5rem;
}

.form-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(
    135deg,
    var(--text-primary) 0%,
    var(--primary-blue-light) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

/* Form Styles */
.form-container {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 1rem;
  padding: 2rem;
}

.form-section {
  display: none;
  animation: fadeIn 0.4s ease-in-out;
}

.form-section.active {
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group.full-width {
  grid-column: 1 / -1;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  pointer-events: none;
  z-index: 2;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.input-group input,
.input-group select,
.input-group textarea {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: var(--dark-input);
  border: 1px solid var(--dark-border);
  border-radius: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-family: inherit;
  transition: var(--transition);
}

.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-group input::placeholder,
.input-group textarea::placeholder {
  color: var(--text-muted);
}

.input-group select {
  appearance: none;
  cursor: pointer;
  padding-right: 2.5rem;
}

.input-group select option {
  background: var(--dark-card);
  color: var(--text-primary);
}

.textarea-wrapper textarea {
  padding-left: 1rem;
  padding-top: 0.75rem;
  min-height: 120px;
  resize: vertical;
}

.textarea-icon {
  top: 0.75rem;
  left: 1rem;
}

/* Tags Input Styles */
.tags-input-container {
  background: var(--dark-input);
  border: 1px solid var(--dark-border);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 50px;
  align-items: center;
  cursor: text;
  transition: var(--transition);
}

.tags-input-container:focus-within {
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: var(--primary-blue);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: tagIn 0.3s ease;
}

@keyframes tagIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.tag-remove {
  cursor: pointer;
  width: 14px;
  height: 14px;
  opacity: 0.8;
  transition: var(--transition);
}

.tag-remove:hover {
  opacity: 1;
  transform: scale(1.1);
}

.tags-input {
  background: transparent;
  border: none;
  color: var(--text-primary);
  flex: 1;
  min-width: 120px;
  padding: 0.25rem;
  font-size: 0.9375rem;
}

.tags-input:focus {
  outline: none;
}

/* Checkbox Styles */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-secondary);
  user-select: none;
}

.checkbox-label input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--dark-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  flex-shrink: 0;
}

.checkbox-label input:checked + .checkmark {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
}

.checkbox-label input:checked + .checkmark::after {
  content: "";
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-top: -2px;
}

.checkbox-text {
  line-height: 1.4;
}

.link {
  color: var(--primary-blue);
  text-decoration: none;
  transition: var(--transition);
}

.link:hover {
  color: var(--primary-blue-light);
  text-decoration: underline;
}

/* Button Styles */
.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--dark-border);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: var(--transition);
  font-family: inherit;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-primary {
  background: var(--primary-blue);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  background: var(--primary-blue-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 12px -2px rgba(37, 99, 235, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--dark-border);
}

.btn-secondary:hover {
  background: var(--dark-input);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.btn-success {
  background: var(--success);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
}

.btn-success:hover {
  background: #059669;
  transform: translateY(-1px);
}
.success-message {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 1rem;
  animation: fadeIn 0.5s ease;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  border: 2px solid var(--success);
}

.check-icon {
  width: 40px;
  height: 40px;
  color: var(--success);
}

.success-message h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.success-message p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    padding: 2rem;
    max-width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 1.5rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .btn {
    width: 100%;
  }

  .form-navigation {
    flex-direction: column-reverse;
    gap: 1rem;
  }
}

/* Focus visible for accessibility */
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
button:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--dark-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--dark-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* ============================================
   BHF DataGuardian — Extended Styles
   ============================================ */

/* Override logo icon color to health green */
.logo-icon {
  color: #10b981;
  width: 28px;
  height: 28px;
}

/* Brand subtitle below logo */
.logo-sub {
  margin-bottom: 2rem;
  margin-top: -2rem;
}

.logo-sub p {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.15rem;
}

.logo-sub .app-name {
  font-size: 0.75rem;
  color: var(--primary-blue-light);
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* Header badge */
.header-badge {
  display: inline-block;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 999px;
  padding: 0.2rem 0.8rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

/* Language toggle in sidebar */
.lang-toggle {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--dark-border);
  border-radius: 0.5rem;
}

.lang-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5rem;
}

.lang-buttons {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  flex: 1;
  padding: 0.4rem 0.5rem;
  background: transparent;
  border: 1px solid var(--dark-border);
  border-radius: 0.375rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.lang-btn:hover {
  background: var(--dark-input);
  color: var(--text-primary);
}

.lang-btn.lang-active {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
  color: white;
  font-weight: 600;
}

/* Section title icon alignment */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

/* Blood pressure dual input row */
.bp-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bp-row .input-wrapper {
  flex: 1;
}

.bp-slash {
  font-size: 1.25rem;
  color: var(--text-muted);
  font-weight: 300;
  flex-shrink: 0;
}

/* BMI auto-calc display */
.bmi-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bmi-display .input-wrapper {
  flex: 1;
}

.bmi-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  flex-shrink: 0;
  transition: var(--transition);
}

/* Field hint text */
.field-hint {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.3rem;
  font-style: italic;
}

/* BMI input readonly look */
input[readonly] {
  opacity: 0.9;
  cursor: default;
  font-weight: 600;
}

/* Success page brand line */
.success-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Language select dropdown in sidebar */
.lang-select {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  background: var(--dark-input);
  border: 1px solid var(--dark-border);
  border-radius: 0.375rem;
  color: var(--text-primary);
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  transition: var(--transition);
}

.lang-select:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.lang-select option {
  background: var(--dark-card);
  color: var(--text-primary);
}

/* ============================================
   Mobile Sidebar Toggle & Topbar
   ============================================ */

/* Sidebar close button — hidden on desktop */
.sidebar-close {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: 1px solid var(--dark-border);
  border-radius: 0.375rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.3rem;
  line-height: 0;
  transition: var(--transition);
}

.sidebar-close:hover {
  background: var(--dark-input);
  color: var(--text-primary);
}

.sidebar-close i {
  width: 18px;
  height: 18px;
}

/* Dark overlay behind open sidebar */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99;
  backdrop-filter: blur(2px);
}

/* Mobile top bar — hidden on desktop */
.mobile-topbar {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.25rem;
  background: var(--dark-card);
  border-bottom: 1px solid var(--dark-border);
  margin-bottom: 1.5rem;
  border-radius: 0.75rem;
  gap: 0.75rem;
}

.hamburger {
  background: transparent;
  border: 1px solid var(--dark-border);
  border-radius: 0.375rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.35rem;
  line-height: 0;
  transition: var(--transition);
  flex-shrink: 0;
}

.hamburger:hover {
  background: var(--dark-input);
  color: var(--text-primary);
}

.hamburger i {
  width: 20px;
  height: 20px;
  display: block;
}

.mobile-brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}

.mobile-step {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary-blue-light);
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  flex-shrink: 0;
}

/* ============================================
   Responsive overrides
   ============================================ */
@media (max-width: 1024px) {
  /* Sidebar slides in from left, overlaying content */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 100;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  /* Show overlay when sidebar is open */
  .sidebar.open ~ * .sidebar-overlay,
  .sidebar-overlay {
    display: block;
  }

  .sidebar-close {
    display: flex;
  }

  .main-content {
    margin-left: 0;
    padding: 1.5rem;
    max-width: 100%;
  }

  .mobile-topbar {
    display: flex;
  }

  .form-header {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 640px) {
  .main-content {
    padding: 1rem;
  }

  .form-container {
    padding: 1.25rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .input-group.full-width {
    grid-column: 1;
  }

  .form-header h1 {
    font-size: 1.4rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .form-navigation {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }

  .bmi-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .bp-row {
    flex-wrap: nowrap;
  }

  .mobile-topbar {
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
}

/* ============================================
   LANDING PAGE STYLES
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

.landing {
  min-height: 100vh;
  background: var(--dark-bg);
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
}

/* ── NAV ─────────────────────────────── */
.landing-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--dark-border);
}

.landing-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.landing-logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
  flex-shrink: 0;
}

.landing-logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #0d9488, #10b981);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.35);
}

.landing-logo-icon i { width: 18px; height: 18px; }

.landing-logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.landing-logo-main {
  font-family: 'Sora', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.landing-logo-sub {
  font-size: 0.65rem;
  color: #10b981;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.landing-nav-links {
  display: flex;
  gap: 0.25rem;
  flex: 1;
}

.nav-link {
  padding: 0.4rem 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: var(--transition);
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(255,255,255,0.05);
}

.landing-nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

.lang-pills {
  display: flex;
  gap: 0.25rem;
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 0.5rem;
  padding: 0.2rem;
}

.lang-pill {
  padding: 0.25rem 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
}

.lang-pill:hover { color: var(--text-primary); }

.lang-pill.active {
  background: var(--primary-blue);
  color: white;
}

.btn-nav-cta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.125rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-family: inherit;
  white-space: nowrap;
}

.btn-nav-cta:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
}

/* ── HERO ─────────────────────────────── */
.landing-hero {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 2rem 4rem;
  gap: 4rem;
  overflow: hidden;
}

.hero-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(16, 185, 129, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.hero-bg-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  flex: 1;
  position: relative;
  z-index: 2;
  animation: heroFadeUp 0.7s ease both;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #10b981;
  border-radius: 999px;
  padding: 0.35rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 1.75rem;
}

.hero-title {
  font-family: 'Sora', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
}

.hero-title-line1 {
  display: block;
  color: var(--text-primary);
}

.hero-title-line2 {
  display: block;
  background: linear-gradient(135deg, #10b981 0%, #0d9488 50%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  font-size: 1.0625rem;
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 0.625rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(16, 185, 129, 0.4);
}

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.875rem 1.5rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--dark-border);
  border-radius: 0.625rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: var(--transition);
  font-family: 'DM Sans', sans-serif;
}

.btn-hero-secondary:hover {
  background: var(--dark-card);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

/* Hero floating card */
.hero-visual {
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  animation: heroFadeUp 0.7s 0.2s ease both;
}

.hero-card {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 1rem;
  padding: 1.25rem;
  width: 300px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.08);
}

.hero-card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.hero-card-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
}
.hero-card-dot.green  { background: #10b981; }
.hero-card-dot.yellow { background: #f59e0b; }
.hero-card-dot.red    { background: #ef4444; }

.hero-card-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-left: 0.25rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.hero-card-rows { display: flex; flex-direction: column; gap: 0.875rem; }

.hero-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.hero-card-row:last-child { border-bottom: none; padding-bottom: 0; }

.hcr-label { font-size: 0.8rem; color: var(--text-muted); }
.hcr-value { font-size: 0.825rem; font-weight: 600; }
.hcr-value.good { color: #10b981; }
.hcr-value.warn { color: #f59e0b; }
.hcr-value.muted { color: var(--text-secondary); }

.hero-card-footer {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--dark-border);
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* ── STATS ─────────────────────────────── */
.landing-stats {
  display: flex;
  justify-content: center;
  gap: 0;
  background: var(--dark-card);
  border-top: 1px solid var(--dark-border);
  border-bottom: 1px solid var(--dark-border);
}

.stat-item {
  flex: 1;
  max-width: 220px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  border-right: 1px solid var(--dark-border);
}
.stat-item:last-child { border-right: none; }

.stat-value {
  display: block;
  font-family: 'Sora', sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: #10b981;
  letter-spacing: -0.03em;
  margin-bottom: 0.35rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.03em;
}

/* ── FEATURES ─────────────────────────────── */
.landing-features {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-tag {
  display: inline-block;
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  color: var(--primary-blue-light);
  border-radius: 999px;
  padding: 0.25rem 0.875rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.section-title-lg {
  font-family: 'Sora', sans-serif;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  margin-bottom: 0.75rem;
}

.section-sub {
  color: var(--text-secondary);
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.feature-card {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 0.875rem;
  padding: 1.75rem;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(16,185,129,0.04), transparent);
  opacity: 0;
  transition: var(--transition);
}

.feature-card:hover {
  border-color: rgba(16, 185, 129, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.3);
}

.feature-card:hover::before { opacity: 1; }

.feature-icon {
  width: 44px;
  height: 44px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  margin-bottom: 1rem;
}

.feature-icon i { width: 20px; height: 20px; }

.feature-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.6rem;
}

.feature-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* ── HOW IT WORKS ─────────────────────────────── */
.landing-how {
  background: var(--dark-card);
  border-top: 1px solid var(--dark-border);
  border-bottom: 1px solid var(--dark-border);
  padding: 6rem 2rem;
}

.landing-how .section-header { margin-bottom: 3rem; }

.how-steps {
  display: flex;
  gap: 0;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

.how-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 1.5rem;
  position: relative;
}

.how-connector {
  position: absolute;
  top: 28px;
  right: -50%;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--dark-border), rgba(16,185,129,0.3), var(--dark-border));
  z-index: 0;
}

.how-step-num {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05));
  border: 1px solid rgba(16,185,129,0.3);
  color: #10b981;
  font-family: 'Sora', sans-serif;
  font-size: 0.875rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  position: relative;
  z-index: 1;
  letter-spacing: 0.05em;
}

.how-step-content h3 {
  font-family: 'Sora', sans-serif;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.how-step-content p {
  font-size: 0.825rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ── CTA BANNER ─────────────────────────────── */
.landing-cta-banner {
  padding: 6rem 2rem;
  text-align: center;
}

.cta-banner-inner {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.cta-banner-icons {
  width: 72px;
  height: 72px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.landing-cta-banner h2 {
  font-family: 'Sora', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.025em;
}

.landing-cta-banner p {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
}

/* ── FOOTER ─────────────────────────────── */
.landing-footer {
  background: var(--dark-card);
  border-top: 1px solid var(--dark-border);
  padding: 3rem 2rem;
}

.landing-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  text-align: center;
}

.footer-tagline {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.footer-rights {
  color: var(--text-muted);
  font-size: 0.75rem;
}

/* ── FORM PAGE BACK BUTTON ─────────────────────────────── */
.back-to-home {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid var(--dark-border);
  color: var(--text-muted);
  border-radius: 0.375rem;
  padding: 0.4rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1.5rem;
  transition: var(--transition);
  font-family: inherit;
}

.back-to-home:hover {
  background: var(--dark-input);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

/* ── SIDEBAR HOME BTN ─────────────────────────────── */
.sidebar-home-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--dark-border);
  color: var(--text-muted);
  border-radius: 0.375rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: var(--transition);
  font-family: inherit;
  width: 100%;
}

.sidebar-home-btn:hover {
  background: var(--dark-input);
  color: var(--text-primary);
}

/* ── ANIMATIONS ─────────────────────────────── */
@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── LANDING RESPONSIVE ─────────────────────────────── */
@media (max-width: 1024px) {
  .landing-hero {
    flex-direction: column;
    min-height: auto;
    padding: 4rem 1.5rem 3rem;
    gap: 3rem;
    text-align: center;
  }
  .hero-sub { margin: 0 auto 2.5rem; }
  .hero-actions { justify-content: center; }
  .hero-visual { display: none; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .landing-nav-links { display: none; }
}

@media (max-width: 768px) {
  .landing-stats {
    flex-wrap: wrap;
  }
  .stat-item {
    flex: 1 1 50%;
    max-width: 50%;
    border-right: none;
    border-bottom: 1px solid var(--dark-border);
  }
  .stat-item:nth-child(odd) { border-right: 1px solid var(--dark-border); }
  .stat-item:nth-last-child(-n+2) { border-bottom: none; }
  .features-grid { grid-template-columns: 1fr; }
  .how-steps { flex-direction: column; gap: 2rem; }
  .how-connector { display: none; }
  .lang-pills { display: none; }
  .landing-nav-inner { padding: 0 1rem; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 2rem; }
  .btn-hero-primary, .btn-hero-secondary { width: 100%; justify-content: center; }
  .hero-actions { flex-direction: column; }
  .btn-nav-cta span { display: none; }
}

/* ============================================
   ANIMATION STYLES
   ============================================ */

/* ── Hero entrance animation ── */
.hero-anim {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
.hero-anim--in {
  opacity: 1;
  transform: translateY(0);
}

/* hero-visual slides in from right */
.hero-visual.hero-anim {
  transform: translateX(32px) translateY(0);
}
.hero-visual.hero-anim--in {
  transform: translateX(0) translateY(0);
}

/* ── Hero card animated rows ── */
.hero-card--animated {
  position: relative;
  overflow: hidden;
}

.hcr--anim {
  opacity: 0;
  transform: translateX(12px);
  transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.hcr--show {
  opacity: 1;
  transform: translateX(0);
}

/* LIVE badge on hero card */
.hero-card-live {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.62rem;
  font-weight: 700;
  color: #10b981;
  letter-spacing: 0.08em;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  animation: livePulse 1.4s ease-in-out infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}

/* timestamp in card footer */
.hcf-timestamp {
  margin-left: auto;
  font-size: 0.68rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

/* ── How-steps staggered reveal ── */
.how-step--anim {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.how-step--visible {
  opacity: 1;
  transform: translateY(0);
}

/* How step number — scale in when visible */
.how-step-num {
  transform: scale(0.6);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.4s ease,
              background 0.3s ease,
              border-color 0.3s ease;
}
.how-step-num--visible {
  transform: scale(1);
  opacity: 1;
}

/* How connector grows in */
.how-connector--anim {
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.how-connector--visible {
  transform: scaleX(1);
}

/* ── Stat items count-up visual polish ── */
.stat-value {
  font-variant-numeric: tabular-nums;
  transition: color 0.3s;
}

/* ── Feature cards stagger on scroll ── */
.feature-card {
  animation: none; /* handled by CSS below */
}

/* ============================================
   ANIMATION ADDITIONS
   ============================================ */

/* Hero content lines — each is a block so transform works independently */
.hero-badge,
.hero-title-line1,
.hero-title-line2,
.hero-sub,
.hero-actions {
  display: block;
}

/* Second glow blob — bottom-left */
.hero-bg-glow-2 {
  top: auto;
  right: auto;
  bottom: -80px;
  left: -80px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.07) 0%, transparent 65%);
}

/* ── ANIMATED HERO CARD ── */
.hero-visual {
  animation: floatCard 4s ease-in-out infinite;
}

@keyframes floatCard {
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* Active/done row states */
.hero-card-row {
  transition: background 0.3s ease, padding 0.3s ease;
  border-radius: 0.375rem;
  padding: 0.1rem 0.3rem;
  margin: 0 -0.3rem;
}

.hero-card-row.row-active {
  background: rgba(16, 185, 129, 0.06);
}

.hero-card-row.row-done .hcr-label {
  color: var(--text-muted);
}

.row-check {
  color: #10b981;
  font-size: 0.7rem;
  margin-right: 0.2rem;
}

.hcr-empty {
  color: var(--text-muted) !important;
  font-weight: 400 !important;
}

/* Pulse dot — flashes when row activates */
.card-pulse-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #10b981;
  border-radius: 50%;
  margin-left: auto;
  animation: pulseDot 0.4s ease forwards;
}

@keyframes pulseDot {
  0%   { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(2.5); }
}

/* Synced footer state */
.footer-synced {
  color: #10b981;
  font-weight: 600;
}

.footer-sync-badge {
  background: rgba(16,185,129,0.15);
  border: 1px solid rgba(16,185,129,0.35);
  color: #10b981;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.1rem 0.45rem;
  letter-spacing: 0.1em;
  animation: badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1);
}

@keyframes badgePop {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* Progress bar at card bottom */
.card-progress-bar {
  height: 3px;
  background: rgba(255,255,255,0.05);
  border-radius: 999px;
  margin-top: 1rem;
  overflow: hidden;
}

.card-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #2563eb);
  border-radius: 999px;
  transition: width 0.25s ease;
}

/* ── STAT COUNT-UP ── */
.stat-item {
  /* base transition set inline per item, adding a shimmer on value */
}

.stat-value {
  position: relative;
  display: inline-block;
}

/* ── HOW STEP POP ── */
.how-step-num {
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
}

.how-step-num.how-step-pop {
  animation: stepNumPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
}

@keyframes stepNumPop {
  0%   { transform: scale(0.5); opacity: 0; }
  60%  { transform: scale(1.15); }
  100% { transform: scale(1);   opacity: 1; }
}

/* ── FEATURE CARD shimmer on hover ── */
.feature-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -60%;
  width: 40%;
  height: 200%;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255,255,255,0.04) 50%,
    transparent 60%
  );
  transform: skewX(-15deg);
  transition: left 0.6s ease;
  pointer-events: none;
}

.feature-card:hover::after {
  left: 130%;
}

/* ── CTA BANNER pulse ring ── */
.cta-banner-icons {
  position: relative;
}

.cta-banner-icons::before,
.cta-banner-icons::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 1px solid rgba(16,185,129,0.2);
  animation: ringPulse 2.5s ease-in-out infinite;
}

.cta-banner-icons::after {
  inset: -16px;
  animation-delay: 0.5s;
}

@keyframes ringPulse {
  0%   { transform: scale(1); opacity: 0.6; }
  50%  { transform: scale(1.12); opacity: 0.2; }
  100% { transform: scale(1); opacity: 0.6; }
}

/* ── NAV CTA ripple effect ── */
.btn-nav-cta {
  position: relative;
  overflow: hidden;
}

.btn-nav-cta::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.15);
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}

.btn-nav-cta:hover::after {
  transform: translateX(100%);
}

/* ── HERO PRIMARY BTN glow pulse ── */
.btn-hero-primary {
  position: relative;
}

.btn-hero-primary::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #10b981, #059669);
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
  filter: blur(8px);
}

.btn-hero-primary:hover::before {
  opacity: 0.5;
}

/* ── GRID BG animation ── */
.hero-bg-grid {
  animation: gridDrift 20s linear infinite;
}

@keyframes gridDrift {
  0%   { background-position: 0 0; }
  100% { background-position: 48px 48px; }
}

/* ============================================
   LOGIN PAGE
   ============================================ */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dark-bg);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.login-bg-glow {
  position: absolute;
  top: -150px; left: 50%;
  transform: translateX(-50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%);
  pointer-events: none;
}

.login-bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.login-card {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 1.25rem;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 2;
  box-shadow: 0 24px 64px rgba(0,0,0,0.4);
  animation: heroFadeUp 0.5s ease both;
}

.login-logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.75rem;
}

.login-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}

.login-sub {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1.75rem;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.login-btn {
  width: 100%;
  margin-top: 0.5rem;
  justify-content: center;
  gap: 0.5rem;
}

.login-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.25);
  color: #ef4444;
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.825rem;
  margin-bottom: 0.5rem;
}

.login-role-hint {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.775rem;
  color: var(--text-muted);
  background: rgba(16,185,129,0.05);
  border: 1px solid rgba(16,185,129,0.12);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
}

.login-toggle {
  text-align: center;
  font-size: 0.825rem;
  color: var(--text-muted);
  margin-top: 1.25rem;
}

.login-toggle-btn {
  background: none;
  border: none;
  color: var(--primary-blue-light);
  font-size: 0.825rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: var(--transition);
}
.login-toggle-btn:hover { color: var(--primary-blue); text-decoration: underline; }

/* Password show/hide toggle */
.pw-toggle {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  line-height: 0;
  z-index: 3;
  transition: var(--transition);
}
.pw-toggle:hover { color: var(--text-primary); }

/* Spinner */
.login-spinner {
  display: inline-block;
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-right: 0.4rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ============================================
   USER CHIP (form top bar)
   ============================================ */
.form-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-radius: 999px;
  padding: 0.35rem 0.75rem 0.35rem 0.35rem;
}

.user-chip-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #2563eb);
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-chip-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-chip-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-chip-role {
  font-size: 0.68rem;
  color: #10b981;
  font-weight: 500;
}

.user-chip-logout {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.2rem;
  line-height: 0;
  transition: var(--transition);
  margin-left: 0.25rem;
}
.user-chip-logout:hover { color: #ef4444; }

/* Submit error banner */
.submit-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.2);
  color: #ef4444;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  margin-top: 1rem;
}


/* How step number — scale in when visible */
.how-step-num {
  transform: scale(0.6);
  opacity: 0;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.4s ease,
              background 0.3s ease,
              border-color 0.3s ease;
}
.how-step-num--visible {
  transform: scale(1);
  opacity: 1;
}

/* How connector grows in */
.how-connector--anim {
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.how-connector--visible {
  transform: scaleX(1);
}

/* ── Stat items count-up visual polish ── */
.stat-value {
  font-variant-numeric: tabular-nums;
  transition: color 0.3s;
}

/* ── Feature cards stagger on scroll ── */
.feature-card {
  animation: none; /* handled by CSS below */
}

/* ============================================
   ANIMATION ADDITIONS
   ============================================ */

/* Hero content lines — each is a block so transform works independently */
.hero-badge,
.hero-title-line1,
.hero-title-line2,
.hero-sub,
.hero-actions {
  display: block;
}

/* Second glow blob — bottom-left */
.hero-bg-glow-2 {
  top: auto;
  right: auto;
  bottom: -80px;
  left: -80px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.07) 0%, transparent 65%);
}

/* ── ANIMATED HERO CARD ── */
.hero-visual {
  animation: floatCard 4s ease-in-out infinite;
}

@keyframes floatCard {
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* Active/done row states */
.hero-card-row {
  transition: background 0.3s ease, padding 0.3s ease;
  border-radius: 0.375rem;
  padding: 0.1rem 0.3rem;
  margin: 0 -0.3rem;
}

.hero-card-row.row-active {
  background: rgba(16, 185, 129, 0.06);
}

.hero-card-row.row-done .hcr-label {
  color: var(--text-muted);
}

.row-check {
  color: #10b981;
  font-size: 0.7rem;
  margin-right: 0.2rem;
}

.hcr-empty {
  color: var(--text-muted) !important;
  font-weight: 400 !important;
}

/* Pulse dot — flashes when row activates */
.card-pulse-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #10b981;
  border-radius: 50%;
  margin-left: auto;
  animation: pulseDot 0.4s ease forwards;
}

@keyframes pulseDot {
  0%   { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(2.5); }
}

/* Synced footer state */
.footer-synced {
  color: #10b981;
  font-weight: 600;
}

.footer-sync-badge {
  background: rgba(16,185,129,0.15);
  border: 1px solid rgba(16,185,129,0.35);
  color: #10b981;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.1rem 0.45rem;
  letter-spacing: 0.1em;
  animation: badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1);
}

@keyframes badgePop {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* Progress bar at card bottom */
.card-progress-bar {
  height: 3px;
  background: rgba(255,255,255,0.05);
  border-radius: 999px;
  margin-top: 1rem;
  overflow: hidden;
}

.card-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #2563eb);
  border-radius: 999px;
  transition: width 0.25s ease;
}

/* ── STAT COUNT-UP ── */
.stat-item {
  /* base transition set inline per item, adding a shimmer on value */
}

.stat-value {
  position: relative;
  display: inline-block;
}

/* ── HOW STEP POP ── */
.how-step-num {
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
}

.how-step-num.how-step-pop {
  animation: stepNumPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
}

@keyframes stepNumPop {
  0%   { transform: scale(0.5); opacity: 0; }
  60%  { transform: scale(1.15); }
  100% { transform: scale(1);   opacity: 1; }
}

/* ── FEATURE CARD shimmer on hover ── */
.feature-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -60%;
  width: 40%;
  height: 200%;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255,255,255,0.04) 50%,
    transparent 60%
  );
  transform: skewX(-15deg);
  transition: left 0.6s ease;
  pointer-events: none;
}

.feature-card:hover::after {
  left: 130%;
}

/* ── CTA BANNER pulse ring ── */
.cta-banner-icons {
  position: relative;
}

.cta-banner-icons::before,
.cta-banner-icons::after {
  content: '';
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 1px solid rgba(16,185,129,0.2);
  animation: ringPulse 2.5s ease-in-out infinite;
}

.cta-banner-icons::after {
  inset: -16px;
  animation-delay: 0.5s;
}

@keyframes ringPulse {
  0%   { transform: scale(1); opacity: 0.6; }
  50%  { transform: scale(1.12); opacity: 0.2; }
  100% { transform: scale(1); opacity: 0.6; }
}

/* ── NAV CTA ripple effect ── */
.btn-nav-cta {
  position: relative;
  overflow: hidden;
}

.btn-nav-cta::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.15);
  transform: translateX(-100%);
  transition: transform 0.4s ease;
}

.btn-nav-cta:hover::after {
  transform: translateX(100%);
}

/* ── HERO PRIMARY BTN glow pulse ── */
.btn-hero-primary {
  position: relative;
}

.btn-hero-primary::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #10b981, #059669);
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
  filter: blur(8px);
}

.btn-hero-primary:hover::before {
  opacity: 0.5;
}

/* ── GRID BG animation ── */
.hero-bg-grid {
  animation: gridDrift 20s linear infinite;
}

@keyframes gridDrift {
  0%   { background-position: 0 0; }
  100% { background-position: 48px 48px; }
}
