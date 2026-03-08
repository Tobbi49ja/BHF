

import { MapPin, ChevronDown, Navigation, Home, Landmark } from 'lucide-react';
import { getLGAs, getCities, STATES } from '../../data/nigeriaAddressData';

export function AddressFields({ address, handlers, derived, errors = {}, disabled = false }) {
  const { states, lgas, cities } = derived;
  const {
    handleStateChange,
    handleLGAChange,
    handleCityChange,
    handleStreetChange,
    handleLandmarkChange,
  } = handlers;

  return (
    <>
      {/* ── State ── */}
      <div className={`input-group ${errors.state ? 'has-error' : ''}`}>
        <label htmlFor="addr-state">
          <MapPin size={12} />
          State <span style={{ color: 'var(--error)' }}>*</span>
        </label>
        <div className="input-wrapper">
          <MapPin className="input-icon" />
          <select
            id="addr-state"
            value={address.state}
            onChange={handleStateChange}
            disabled={disabled}
            aria-describedby={errors.state ? 'addr-state-err' : undefined}
          >
            <option value="">— Select State —</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="select-arrow" />
        </div>
        {errors.state && (
          <span id="addr-state-err" className="field-error" role="alert">
            {errors.state}
          </span>
        )}
      </div>

      {/* ── LGA ── */}
      <div className={`input-group ${errors.lga ? 'has-error' : ''}`}>
        <label htmlFor="addr-lga">
          <Navigation size={12} />
          Local Government Area <span style={{ color: 'var(--error)' }}>*</span>
        </label>
        <div className="input-wrapper">
          <Navigation className="input-icon" />
          <select
            id="addr-lga"
            value={address.lga}
            onChange={handleLGAChange}
            disabled={disabled || !address.state}
            aria-describedby={errors.lga ? 'addr-lga-err' : undefined}
          >
            <option value="">
              {!address.state ? '— Select a state first —' : '— Select LGA —'}
            </option>
            {lgas.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <ChevronDown className="select-arrow" />
        </div>
        {!address.state && (
          <span className="field-hint">Select a state to unlock LGAs</span>
        )}
        {errors.lga && (
          <span id="addr-lga-err" className="field-error" role="alert">
            {errors.lga}
          </span>
        )}
      </div>

      {/* ── City / Town ── */}
      <div className={`input-group ${errors.city ? 'has-error' : ''}`}>
        <label htmlFor="addr-city">
          <Home size={12} />
          City / Town <span style={{ color: 'var(--error)' }}>*</span>
        </label>
        <div className="input-wrapper">
          <Home className="input-icon" />
          <select
            id="addr-city"
            value={address.city}
            onChange={handleCityChange}
            disabled={disabled || !address.lga}
            aria-describedby={errors.city ? 'addr-city-err' : undefined}
          >
            <option value="">
              {!address.lga ? '— Select LGA first —' : '— Select City/Town —'}
            </option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown className="select-arrow" />
        </div>
        {!address.lga && (
          <span className="field-hint">Select an LGA to unlock cities</span>
        )}
        {errors.city && (
          <span id="addr-city-err" className="field-error" role="alert">
            {errors.city}
          </span>
        )}
      </div>

      {/* ── Street Address ── */}
      <div className={`input-group full-width ${errors.street ? 'has-error' : ''}`}>
        <label htmlFor="addr-street">
          <MapPin size={12} />
          Street Address <span style={{ color: 'var(--error)' }}>*</span>
        </label>
        <div className="input-wrapper">
          <MapPin className="input-icon" />
          <input
            id="addr-street"
            type="text"
            value={address.street}
            onChange={handleStreetChange}
            placeholder="e.g. 12 Ahmadu Bello Way"
            disabled={disabled}
            maxLength={200}
            aria-describedby={errors.street ? 'addr-street-err' : undefined}
          />
        </div>
        {errors.street && (
          <span id="addr-street-err" className="field-error" role="alert">
            {errors.street}
          </span>
        )}
      </div>

      {/* ── Landmark (optional) ── */}
      <div className="input-group full-width">
        <label htmlFor="addr-landmark">
          <Landmark size={12} />
          Nearest Landmark
          <span style={{ color: 'var(--text-3)', fontWeight: 400, marginLeft: '0.25rem' }}>
            (optional)
          </span>
        </label>
        <div className="input-wrapper">
          <Landmark className="input-icon" />
          <input
            id="addr-landmark"
            type="text"
            value={address.landmark}
            onChange={handleLandmarkChange}
            placeholder="e.g. Opposite Unity Bank, near Central Mosque"
            disabled={disabled}
            maxLength={200}
          />
        </div>
        <span className="field-hint">
          Helps with accurate location identification
        </span>
      </div>

      {/* ── Full Address Preview ── */}
      {derived.isAddressComplete && (
        <div className="input-group full-width">
          <label>
            <MapPin size={12} />
            Address Preview
          </label>
          <div className="address-preview">
            <MapPin size={14} style={{ flexShrink: 0, color: 'var(--success)' }} />
            <span>{derived.fullAddress}</span>
          </div>
        </div>
      )}
    </>
  );
}
import { useState, useEffect } from "react";
import Icon from "./Icon";
import { getAdminRecords, getUsers, deleteUser, updateUserRole, exportRecordsExcel } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ROLES = ["Field Volunteer", "Health Worker", "Program Manager", "Data Analyst", "Administrator"];

export default function AdminDashboard({ onBack }) {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("records");
  const [records, setRecords] = useState([]);
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => { loadData(); }, [tab]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (tab === "records") {
        const data = await getAdminRecords(user.token);
        setRecords(data);
      } else {
        const data = await getUsers(user.token);
        setUsers(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await deleteUser(user.token, id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(user.token, id, role);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role } : u));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try { await exportRecordsExcel(user.token); }
    finally { setExporting(false); }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const filteredRecords = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.firstName?.toLowerCase().includes(q) ||
      r.lastName?.toLowerCase().includes(q)  ||
      r.address?.toLowerCase().includes(q)   ||
      r.submittedBy?.fullName?.toLowerCase().includes(q)
    );
  });

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const bmiColor = (bmi) => {
    if (!bmi) return "var(--text-3)";
    const b = parseFloat(bmi);
    if (b < 18.5) return "#f59e0b";
    if (b < 25)   return "#10b981";
    if (b < 30)   return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="admin-page">
      <div className="admin-bg-grid" />

      {/* ── Header ── */}
      <div className="admin-header">
        <div className="admin-header-left">
          <div className="landing-logo-icon">
            <Icon name="shield-plus" size={18} />
          </div>
          <div className="admin-title-block">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-sub">
              Logged in as <strong>{user.fullName}</strong> · Administrator
            </p>
          </div>
        </div>

        <div className="admin-header-right">
          {/* User chip */}
          <div className="user-chip">
            <div className="user-chip-avatar">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="user-chip-info">
              <span className="user-chip-name">{user.fullName}</span>
              <span className="user-chip-role">Administrator</span>
            </div>
            <button
              className="user-chip-logout"
              onClick={handleLogout}
              title="Logout"
            >
              <Icon name="log-out" size={15} />
            </button>
          </div>

          {/* Export button */}
          {tab === "records" && (
            <button
              className="btn btn-success"
              onClick={handleExport}
              disabled={exporting || records.length === 0}
            >
              {exporting
                ? <><span className="login-spinner" />Exporting...</>
                : <><Icon name="file-text" size={16} />Export to Excel</>
              }
            </button>
          )}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="admin-stats-bar">
        <div className="admin-stat">
          <span className="admin-stat-val">{records.length}</span>
          <span className="admin-stat-label">Total Records</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-val">{users.length}</span>
          <span className="admin-stat-label">Registered Users</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-val">
            {records.filter((r) => {
              const d = new Date(r.createdAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </span>
          <span className="admin-stat-label">This Month</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-val">
            {users.filter((u) => u.role === "Field Volunteer").length}
          </span>
          <span className="admin-stat-label">Field Volunteers</span>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="admin-toolbar">
        <div className="admin-tabs">
          <button
            className={`admin-tab${tab === "records" ? " active" : ""}`}
            onClick={() => { setTab("records"); setSearch(""); }}
          >
            <Icon name="clipboard-list" size={15} />
            Beneficiary Records
          </button>
          <button
            className={`admin-tab${tab === "users" ? " active" : ""}`}
            onClick={() => { setTab("users"); setSearch(""); }}
          >
            <Icon name="users" size={15} />
            Manage Users
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
          <div className="input-wrapper" style={{ maxWidth: 340, width: "100%" }}>
            <Icon name="search" size={16} className="input-icon" />
            <input
              type="text"
              placeholder={tab === "records" ? "Search by name, address, volunteer…" : "Search by name or email…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "0.6rem 1rem 0.6rem 2.5rem",
                background: "var(--input)", border: "1px solid var(--border)",
                borderRadius: "0.5rem", color: "var(--text)",
                fontSize: "0.875rem", fontFamily: "inherit",
              }}
            />
          </div>
          <button className="btn btn-secondary" onClick={loadData} style={{ flexShrink: 0 }}>
            <Icon name="refresh-cw" size={15} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="submit-error">
          <Icon name="x" size={14} />{error}
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="admin-loading">
          <span className="login-spinner" style={{ width: 20, height: 20 }} />
          Loading...
        </div>
      )}

      {/* ── Records table ── */}
      {!loading && tab === "records" && (
        <div className="admin-table-wrap">
          {filteredRecords.length === 0 ? (
            <div className="admin-loading">
              <Icon name="clipboard-list" size={32} />
              No records found
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>BP</th>
                  <th>Blood Sugar</th>
                  <th>BMI</th>
                  <th>Conditions</th>
                  <th>Volunteer</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r) => (
                  <tr key={r._id}>
                    <td className="td-name">{r.firstName} {r.lastName}</td>
                    <td className="td-muted" style={{ textTransform: "capitalize" }}>{r.gender || "—"}</td>
                    <td className="td-muted">{r.age || "—"}</td>
                    <td className="td-muted">{r.phone || "—"}</td>
                    <td className="td-muted">{r.address || "—"}</td>
                    <td className="td-muted">
                      {r.bloodPressureSystolic && r.bloodPressureDiastolic
                        ? `${r.bloodPressureSystolic}/${r.bloodPressureDiastolic}`
                        : "—"}
                    </td>
                    <td className="td-muted">{r.bloodSugar ? `${r.bloodSugar} mg/dL` : "—"}</td>
                    <td>
                      {r.bmi
                        ? <span style={{ color: bmiColor(r.bmi), fontWeight: 700 }}>{r.bmi}</span>
                        : "—"}
                    </td>
                    <td>
                      {r.conditions?.length
                        ? r.conditions.map((c) => (
                          <span key={c} className="tag" style={{ fontSize: "0.68rem", padding: "0.15rem 0.5rem", marginRight: 2 }}>{c}</span>
                        ))
                        : "—"}
                    </td>
                    <td className="td-muted">{r.submittedBy?.fullName || r.volunteerName || "—"}</td>
                    <td className="td-muted" style={{ whiteSpace: "nowrap", fontSize: "0.78rem" }}>
                      {new Date(r.submittedAt || r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Users table ── */}
      {!loading && tab === "users" && (
        <div className="admin-table-wrap">
          {filteredUsers.length === 0 ? (
            <div className="admin-loading">
              <Icon name="users" size={32} />
              No users found
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div className="user-chip-avatar" style={{ width: 28, height: 28, fontSize: "0.72rem" }}>
                          {u.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="td-name">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="td-muted">{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="role-select"
                        disabled={u._id === user._id}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="td-muted" style={{ fontSize: "0.78rem" }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {u._id !== user._id && (
                        <button
                          className="icon-btn red"
                          onClick={() => handleDeleteUser(u._id)}
                          title="Delete user"
                        >
                          <Icon name="trash-2" size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
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

const langLabels   = { en: "Language", ha: "Harshe", yo: "Èdè", ig: "Asụsụ", fr: "Langue", ar: "اللغة" };
const secureLabels = { en: "Secure & encrypted", ha: "Tsaro & sirri", yo: "Aabo & fifi pamọ", ig: "Nchekwa & ezipụta", fr: "Sécurisé & chiffré", ar: "آمن ومشفر" };
const homeLabels   = { en: "Back to Home", ha: "Gida", yo: "Ile", ig: "Ulo", fr: "Accueil", ar: "الرئيسية" };

function Dashboard({ currentStep, setCurrentStep, lang, setLang, dashboardOpen, setDashboardOpen, onBackToHome }) {
  const steps = stepLabels[lang] || stepLabels.en;
  const isRTL = lang === "ar";

  return (
    <aside className={`dashboard${dashboardOpen ? " open" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
      <button className="dashboard-close" onClick={() => setDashboardOpen(false)}>
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
            <div
              key={stepNumber}
              className={`step${currentStep === stepNumber ? " active" : ""}${currentStep > stepNumber ? " completed" : ""}`}
              onClick={() => setCurrentStep(stepNumber)}
            >
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

      <button className="dashboard-home-btn" onClick={onBackToHome}>
        <Icon name="house" size={15} />
        {homeLabels[lang] || homeLabels.en}
      </button>

      <div className="dashboard-footer">
        <p>{secureLabels[lang] || secureLabels.en}</p>
        <div className="security-badges">
          <Icon name="shield-check" size={16} className="badge-icon" />
          <Icon name="lock" size={16} className="badge-icon" />
        </div>
      </div>
    </aside>
  );
}

export default Dashboard;
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


      <section className="landing-hero">
        <div className="hero-bg-grid"></div>
        <div className="hero-bg-glow"></div>
        <div className="hero-bg-glow hero-bg-glow-2"></div>
        <HeroContent t={t} onStart={onStart} />
        <div className="hero-visual"><AnimatedHeroCard /></div>
      </section>

    
      <section className="landing-stats">
        {t.stats.map((s, i) => <StatItem key={i} value={s.value} label={s.label} delay={i * 120} />)}
      </section>

      
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
import {
  Activity, ArrowLeft, ArrowRight, BadgeCheck, BarChart2,
  Briefcase, Building2, Calculator, Calendar, Check,
  CheckCircle2, ChevronDown, ClipboardList, Droplets,
  Eye, EyeOff, FileSpreadsheet, Globe, HeartPulse,
  House, Lock, LogOut, Mail, MapPin, Menu, Phone,
  Ruler, Scale, ShieldCheck, ShieldPlus, Smartphone,
  TrendingUp, Trash2, User, UserRound, Users, X,
} from "lucide-react";

const MAP = {
  "activity": Activity, "arrow-left": ArrowLeft, "arrow-right": ArrowRight,
  "badge-check": BadgeCheck, "bar-chart-2": BarChart2, "briefcase": Briefcase,
  "building-2": Building2, "calculator": Calculator, "calendar": Calendar,
  "check": Check, "check-circle-2": CheckCircle2, "chevron-down": ChevronDown,
  "clipboard-list": ClipboardList, "droplets": Droplets, "eye": Eye,
  "eye-off": EyeOff, "file-spreadsheet": FileSpreadsheet, "globe": Globe,
  "heart-pulse": HeartPulse, "house": House, "lock": Lock, "log-out": LogOut,
  "mail": Mail, "map-pin": MapPin, "menu": Menu, "phone": Phone,
  "ruler": Ruler, "scale": Scale, "shield-check": ShieldCheck,
  "shield-plus": ShieldPlus, "smartphone": Smartphone, "trending-up": TrendingUp,
  "trash-2": Trash2, "user": User, "user-round": UserRound, "users": Users, "x": X,
};

export default function Icon({ name, size = 18, color, className, style }) {
  const C = MAP[name];
  if (!C) return <span style={{ display: "inline-block", width: size, height: size }} />;
  return <C size={size} color={color} className={className} style={style} strokeWidth={1.75} />;
}

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
import { useEffect } from "react";
import Icon from "./Icon";
import { useNigeriaAddress } from "../hooks/useNigeriaAddress";
import { AddressFields }     from "./address/AddressFields";

const t = {
  en: {
    title: "Beneficiary Profile",
    firstName: "First Name", lastName: "Last Name", gender: "Gender",
    genderOptions: ["Select gender", "Male", "Female", "Prefer not to say"],
    age: "Age", phone: "Phone Number",
    volunteerName: "Volunteer / Recorder Name",
    placeholders: {
      firstName: "e.g. Amina", lastName: "e.g. Musa",
      age: "e.g. 34", phone: "+234 800 000 0000",
      volunteerName: "Full name of recorder",
    },
  },
  ha: {
    title: "Bayanan Amfani",
    firstName: "Suna", lastName: "Sunan Iyali", gender: "Jinsi",
    genderOptions: ["Zaɓi jinsi", "Namiji", "Mace", "Ba zan bayyana ba"],
    age: "Shekaru", phone: "Lambar Waya",
    volunteerName: "Sunan Mai Yin Rikodin",
    placeholders: {
      firstName: "misali: Amina", lastName: "misali: Musa",
      age: "misali: 34", phone: "+234 800 000 0000",
      volunteerName: "Cikakken suna",
    },
  },
};

function Step1({ formData, setFormData, lang }) {
  const i18n = t[lang] || t.en;

  // Plain field handler — unchanged from your original
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Address hook — seeded from existing record when editing
  const { address, handlers, derived } = useNigeriaAddress(
    formData.address || {}
  );

  // Sync address hook state → parent formData whenever any address field changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      address: {
        street:   address.street,
        landmark: address.landmark,
        city:     address.city,
        lga:      address.lga,
        state:    address.state,
        country:  "Nigeria",
        full:     derived.fullAddress,
      },
    }));
  }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="form-section active" id="step1">
      <h2 className="section-title">
        <Icon name="user-round" size={20} />
        {i18n.title}
      </h2>

      <div className="form-grid">

        {/* First Name */}
        <div className="input-group">
          <label htmlFor="firstName">{i18n.firstName}</label>
          <div className="input-wrapper">
            <Icon name="user" size={16} className="input-icon" />
            <input
              type="text" id="firstName" name="firstName"
              placeholder={i18n.placeholders.firstName}
              value={formData.firstName} onChange={handleChange} required
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="input-group">
          <label htmlFor="lastName">{i18n.lastName}</label>
          <div className="input-wrapper">
            <Icon name="user" size={16} className="input-icon" />
            <input
              type="text" id="lastName" name="lastName"
              placeholder={i18n.placeholders.lastName}
              value={formData.lastName} onChange={handleChange} required
            />
          </div>
        </div>

        {/* Gender */}
        <div className="input-group">
          <label htmlFor="gender">{i18n.gender}</label>
          <div className="input-wrapper">
            <Icon name="users" size={16} className="input-icon" />
            <select
              id="gender" name="gender"
              value={formData.gender} onChange={handleChange} required
            >
              {i18n.genderOptions.map((opt, i) => (
                <option key={i} value={i === 0 ? "" : opt.toLowerCase()} disabled={i === 0}>
                  {opt}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" size={14} className="select-arrow" />
          </div>
        </div>

        {/* Age */}
        <div className="input-group">
          <label htmlFor="age">{i18n.age}</label>
          <div className="input-wrapper">
            <Icon name="calendar" size={16} className="input-icon" />
            <input
              type="number" id="age" name="age"
              placeholder={i18n.placeholders.age} min="1" max="120"
              value={formData.age} onChange={handleChange} required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="input-group">
          <label htmlFor="phone">{i18n.phone}</label>
          <div className="input-wrapper">
            <Icon name="phone" size={16} className="input-icon" />
            <input
              type="tel" id="phone" name="phone"
              placeholder={i18n.placeholders.phone}
              value={formData.phone} onChange={handleChange}
            />
          </div>
        </div>

        {/* Dynamic Address — replaces the old single address input */}
        <AddressFields
          address={address}
          handlers={handlers}
          derived={derived}
        />

        {/* Volunteer Name */}
        <div className="input-group full-width">
          <label htmlFor="volunteerName">{i18n.volunteerName}</label>
          <div className="input-wrapper">
            <Icon name="badge-check" size={16} className="input-icon" />
            <input
              type="text" id="volunteerName" name="volunteerName"
              placeholder={i18n.placeholders.volunteerName}
              value={formData.volunteerName} onChange={handleChange} required
            />
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
  const [user,  setUser]  = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("bhf_user");
      if (s) setUser(JSON.parse(s));
    } catch (_) {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (user) localStorage.setItem("bhf_user", JSON.stringify(user));
    else localStorage.removeItem("bhf_user");
  }, [user, ready]);

  const login  = (u) => setUser(u);
  const logout = ()  => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
};


export const NIGERIA_ADDRESS_DATA = {
  "Abia": {
    lgas: {
      "Aba North": ["Aba", "Ariaria", "Eziama", "Obuda"],
      "Aba South": ["Aba", "Igwebuike", "Nkwoagu", "Obohia"],
      "Arochukwu": ["Arochukwu", "Ohafia", "Abam", "Ututu"],
      "Bende": ["Bende", "Uzuakoli", "Isuikwuato", "Ohafia"],
      "Isuikwuato": ["Isuikwuato", "Uturu", "Ntigha", "Abiriba"],
      "Isiala Ngwa North": ["Omoba", "Amapu", "Isiala Ngwa", "Ntigha"],
      "Isiala Ngwa South": ["Okpuala", "Nkwo Ntigha", "Obohia", "Ntigha"],
      "Obingwa": ["Obingwa", "Umuoha", "Mgboko", "Amaise"],
      "Ohafia": ["Ohafia", "Abiriba", "Ebem", "Nkporo"],
      "Osisioma": ["Osisioma", "Umuola", "Eziukwu", "Asa"],
      "Ugwunagbo": ["Ugwunagbo", "Akwete", "Obete", "Asa"],
      "Ukwa East": ["Azumini", "Ukwa", "Obete", "Oguta"],
      "Ukwa West": ["Ohanku", "Ndoki", "Obete", "Asa"],
      "Umuahia North": ["Umuahia", "Ibeku", "Nkwoagu", "Alaoji"],
      "Umuahia South": ["Umuahia", "Olokoro", "Ikwuano", "Ntigha"],
      "Umu Nneochi": ["Umu Nneochi", "Uturu", "Ntigha", "Isuikwuato"]
    }
  },
  "Adamawa": {
    lgas: {
      "Demsa": ["Demsa", "Lafin", "Dong", "Kiri"],
      "Fufure": ["Fufure", "Malabu", "Yadim", "Gurin"],
      "Ganye": ["Ganye", "Sugu", "Mayo-Ine", "Toungo"],
      "Girei": ["Girei", "Gayama", "Bambal", "Song"],
      "Gombi": ["Gombi", "Baza", "Birni", "Zumo"],
      "Guyuk": ["Guyuk", "Toungo", "Daware", "Mbulo"],
      "Hong": ["Hong", "Garaha", "Wunti", "Daware"],
      "Jada": ["Jada", "Toungo", "Gurumpawo", "Sugu"],
      "Lamurde": ["Lamurde", "Yola", "Demsa", "Kiri"],
      "Madagali": ["Madagali", "Gulak", "Wula", "Bazza"],
      "Maiha": ["Maiha", "Yola", "Belel", "Malabu"],
      "Mayo-Belwa": ["Mayo-Belwa", "Toungo", "Jada", "Sugu"],
      "Michika": ["Michika", "Mubi", "Madagali", "Gulak"],
      "Mubi North": ["Mubi", "Uba", "Bazza", "Biu"],
      "Mubi South": ["Mubi", "Uba", "Bazza", "Hong"],
      "Numan": ["Numan", "Demsa", "Lafin", "Kiri"],
      "Shelleng": ["Shelleng", "Dong", "Kiri", "Lafin"],
      "Song": ["Song", "Girei", "Bambal", "Gayama"],
      "Toungo": ["Toungo", "Jada", "Ganye", "Sugu"],
      "Yola North": ["Yola", "Jimeta", "Doubeli", "Jambutu"],
      "Yola South": ["Yola", "Rumde", "Adarawo", "Gwadabawa"]
    }
  },
  "Akwa Ibom": {
    lgas: {
      "Abak": ["Abak", "Ikot Ekpene", "Etim Ekpo", "Ukanafun"],
      "Eastern Obolo": ["Eket", "Oron", "Uyo", "Ibeno"],
      "Eket": ["Eket", "Esit Eket", "Ibeno", "Ikot Abasi"],
      "Esit Eket": ["Eket", "Ibeno", "Ikot Abasi", "Esit"],
      "Essien Udim": ["Essien Udim", "Ikot Ekpene", "Abak", "Ukanafun"],
      "Etim Ekpo": ["Abak", "Ikot Ekpene", "Ukanafun", "Etim Ekpo"],
      "Etinan": ["Etinan", "Nsit Ubium", "Abak", "Ikot Ekpene"],
      "Ibeno": ["Ibeno", "Eket", "Esit Eket", "Ikot Abasi"],
      "Ibesikpo Asutan": ["Eket", "Uyo", "Ikot Abasi", "Asutan"],
      "Ikono": ["Ikono", "Ikot Ekpene", "Abak", "Ukanafun"],
      "Ikot Abasi": ["Ikot Abasi", "Eket", "Ibeno", "Oron"],
      "Ikot Ekpene": ["Ikot Ekpene", "Abak", "Essien Udim", "Ukanafun"],
      "Ini": ["Ini", "Ikot Ekpene", "Abak", "Ukanafun"],
      "Itu": ["Itu", "Uyo", "Ikot Ekpene", "Nkari"],
      "Mbo": ["Oron", "Eket", "Mbo", "Ibeno"],
      "Mkpat Enin": ["Ikot Abasi", "Eket", "Oron", "Enin"],
      "Nsit Atai": ["Uyo", "Ikot Ekpene", "Abak", "Atai"],
      "Nsit Ibom": ["Uyo", "Ikot Ekpene", "Abak", "Ibom"],
      "Nsit Ubium": ["Etinan", "Abak", "Ikot Ekpene", "Ubium"],
      "Obot Akara": ["Ikot Ekpene", "Abak", "Ukanafun", "Akara"],
      "Okobo": ["Oron", "Eket", "Ibeno", "Okobo"],
      "Onna": ["Eket", "Ibeno", "Ikot Abasi", "Onna"],
      "Oron": ["Oron", "Eket", "Ibeno", "Mbo"],
      "Oruk Anam": ["Ikot Abasi", "Eket", "Oron", "Anam"],
      "Ukanafun": ["Ukanafun", "Abak", "Ikot Ekpene", "Essien Udim"],
      "Uruan": ["Uyo", "Uruan", "Ikot Ekpene", "Itu"],
      "Urue-Offong/Oruko": ["Oron", "Eket", "Ibeno", "Oruko"],
      "Uyo": ["Uyo", "Ikot Ekpene", "Abak", "Eket"]
    }
  },
  "Anambra": {
    lgas: {
      "Aguata": ["Aguata", "Ekwulobia", "Igboukwu", "Nnewi"],
      "Anambra East": ["Aguleri", "Umuleri", "Nteje", "Otuocha"],
      "Anambra West": ["Nzam", "Ezi-Oye", "Molusi", "Ifitedunu"],
      "Anaocha": ["Adazi-Nnukwu", "Agulu", "Neni", "Ichida"],
      "Awka North": ["Awka", "Mgbakwu", "Amanuke", "Achalla"],
      "Awka South": ["Awka", "Amikwo", "Nibo", "Okpuno"],
      "Ayamelum": ["Anaku", "Igbariam", "Omor", "Ifite-Ogwari"],
      "Dunukofia": ["Ifite-Dunu", "Ukpo", "Umunnachi", "Nawgu"],
      "Ekwusigo": ["Ozubulu", "Ichi", "Ekwulobia", "Atani"],
      "Idemili North": ["Onitsha", "Ogidi", "Nkpor", "Oba"],
      "Idemili South": ["Ojoto", "Oraukwu", "Alor", "Obosi"],
      "Ihiala": ["Ihiala", "Nnewi", "Lilu", "Mbosi"],
      "Njikoka": ["Abagana", "Enugwu-Agidi", "Nawgu", "Nimo"],
      "Nnewi North": ["Nnewi", "Otolo", "Uruagu", "Umudim"],
      "Nnewi South": ["Nnewi", "Osumenyi", "Ukpor", "Amichi"],
      "Ogbaru": ["Atani", "Onitsha", "Oguta", "Ossomala"],
      "Onitsha North": ["Onitsha", "GRA", "Trans-Ekulu", "Odoakpu"],
      "Onitsha South": ["Onitsha", "Fegge", "Woliwo", "Inland Town"],
      "Orumba North": ["Ajalli", "Nanka", "Oko", "Agulu"],
      "Orumba South": ["Agbudu", "Awgbu", "Nkerechi", "Ufuma"],
      "Oyi": ["Nteje", "Awkuzu", "Ogbunike", "Umunya"]
    }
  },
  "Bauchi": {
    lgas: {
      "Alkaleri": ["Alkaleri", "Lame", "Gwaram", "Duguri"],
      "Bauchi": ["Bauchi", "Wunti", "Birchi", "Miri"],
      "Bogoro": ["Bogoro", "Tafawa Balewa", "Lere", "Alkaleri"],
      "Damban": ["Damban", "Gamawa", "Jama'are", "Alkaleri"],
      "Darazo": ["Darazo", "Biu", "Yakubu", "Kari"],
      "Dass": ["Dass", "Bogoro", "Tafawa Balewa", "Lere"],
      "Gamawa": ["Gamawa", "Damban", "Jama'are", "Misau"],
      "Ganjuwa": ["Ganjuwa", "Bauchi", "Azare", "Misau"],
      "Giade": ["Giade", "Jama'are", "Misau", "Azare"],
      "Itas/Gadau": ["Itas", "Gadau", "Azare", "Misau"],
      "Jama'are": ["Jama'are", "Misau", "Azare", "Gamawa"],
      "Katagum": ["Azare", "Misau", "Gamawa", "Jama'are"],
      "Kirfi": ["Kirfi", "Alkaleri", "Lame", "Gwaram"],
      "Misau": ["Misau", "Azare", "Gamawa", "Jama'are"],
      "Ningi": ["Ningi", "Alkaleri", "Lame", "Gwaram"],
      "Shira": ["Shira", "Azare", "Misau", "Gamawa"],
      "Tafawa Balewa": ["Tafawa Balewa", "Bogoro", "Dass", "Lere"],
      "Toro": ["Toro", "Bauchi", "Ganjuwa", "Lere"],
      "Warji": ["Warji", "Azare", "Misau", "Gamawa"],
      "Zaki": ["Zaki", "Azare", "Misau", "Gamawa"]
    }
  },
  "Bayelsa": {
    lgas: {
      "Brass": ["Brass", "Twon Brass", "Okpoama", "Liama"],
      "Ekeremor": ["Ekeremor", "Agge", "Oporoma", "Agbere"],
      "Kolokuma/Opokuma": ["Kaiama", "Kokodiagbene", "Opokuma", "Kolokuma"],
      "Nembe": ["Nembe", "Bassambiri", "Ogbolomabiri", "Liama"],
      "Ogbia": ["Ogbia", "Otuabula", "Otuoke", "Anyama"],
      "Sagbama": ["Sagbama", "Kaiama", "Tungbo", "Agbere"],
      "Southern Ijaw": ["Burutu", "Patani", "Angalabiri", "Olugbobiri"],
      "Yenagoa": ["Yenagoa", "Amarata", "Opolo", "Kpansia"]
    }
  },
  "Benue": {
    lgas: {
      "Ado": ["Ado", "Otukpo", "Ogbadibo", "Apa"],
      "Agatu": ["Agatu", "Otukpo", "Ogbadibo", "Apa"],
      "Apa": ["Apa", "Otukpo", "Ogbadibo", "Agatu"],
      "Buruku": ["Buruku", "Gboko", "Tarka", "Guma"],
      "Gboko": ["Gboko", "Tarka", "Buruku", "Guma"],
      "Guma": ["Makurdi", "Guma", "Logo", "Buruku"],
      "Gwer East": ["Yandev", "Naka", "Gwer", "Makurdi"],
      "Gwer West": ["Naka", "Gwer", "Yandev", "Makurdi"],
      "Katsina-Ala": ["Katsina-Ala", "Logo", "Ushongo", "Vandeikya"],
      "Konshisha": ["Konshisha", "Tiv", "Buruku", "Gboko"],
      "Kwande": ["Adikpo", "Kwande", "Vandeikya", "Ushongo"],
      "Logo": ["Logo", "Katsina-Ala", "Ushongo", "Vandeikya"],
      "Makurdi": ["Makurdi", "North Bank", "Wadata", "High Level"],
      "Obi": ["Obi", "Otukpo", "Ogbadibo", "Apa"],
      "Ogbadibo": ["Otukpo", "Ogbadibo", "Apa", "Agatu"],
      "Ohimini": ["Ohimini", "Otukpo", "Ogbadibo", "Apa"],
      "Oju": ["Oju", "Otukpo", "Ogbadibo", "Apa"],
      "Okpokwu": ["Otukpo", "Okpokwu", "Apa", "Agatu"],
      "Otukpo": ["Otukpo", "Adoka", "Ogbadibo", "Okpokwu"],
      "Tarka": ["Tarka", "Gboko", "Buruku", "Guma"],
      "Ukum": ["Ukum", "Katsina-Ala", "Logo", "Ushongo"],
      "Ushongo": ["Ushongo", "Katsina-Ala", "Logo", "Vandeikya"],
      "Vandeikya": ["Vandeikya", "Kwande", "Ushongo", "Logo"]
    }
  },
  "Borno": {
    lgas: {
      "Abadam": ["Abadam", "Mobbar", "Guzamala", "Nganzai"],
      "Askira/Uba": ["Uba", "Askira", "Biu", "Hawul"],
      "Bama": ["Bama", "Dikwa", "Konduga", "Jere"],
      "Bayo": ["Bayo", "Hawul", "Kwaya Kusar", "Biu"],
      "Biu": ["Biu", "Hawul", "Kwaya Kusar", "Shani"],
      "Chibok": ["Chibok", "Damboa", "Biu", "Hawul"],
      "Damboa": ["Damboa", "Chibok", "Biu", "Gwoza"],
      "Dikwa": ["Dikwa", "Bama", "Konduga", "Jere"],
      "Gubio": ["Gubio", "Nganzai", "Guzamala", "Mobbar"],
      "Guzamala": ["Guzamala", "Nganzai", "Mobbar", "Abadam"],
      "Gwoza": ["Gwoza", "Damboa", "Askira/Uba", "Biu"],
      "Hawul": ["Kwaya Kusar", "Biu", "Hawul", "Shani"],
      "Jere": ["Maiduguri", "Jere", "Konduga", "Bama"],
      "Kaga": ["Kaga", "Magumeri", "Nganzai", "Gubio"],
      "Kala/Balge": ["Kala", "Balge", "Bama", "Dikwa"],
      "Konduga": ["Konduga", "Bama", "Jere", "Maiduguri"],
      "Kukawa": ["Kukawa", "Mobbar", "Guzamala", "Nganzai"],
      "Kwaya Kusar": ["Kwaya Kusar", "Hawul", "Biu", "Shani"],
      "Mafa": ["Mafa", "Konduga", "Bama", "Dikwa"],
      "Magumeri": ["Magumeri", "Nganzai", "Gubio", "Kaga"],
      "Maiduguri": ["Maiduguri", "Bolori", "Gwange", "Old Maiduguri"],
      "Marte": ["Marte", "Mobbar", "Nganzai", "Guzamala"],
      "Mobbar": ["Mobbar", "Kukawa", "Guzamala", "Nganzai"],
      "Monguno": ["Monguno", "Kukawa", "Mobbar", "Nganzai"],
      "Ngala": ["Ngala", "Dikwa", "Bama", "Kala/Balge"],
      "Nganzai": ["Nganzai", "Gubio", "Kaga", "Guzamala"],
      "Shani": ["Shani", "Biu", "Hawul", "Kwaya Kusar"]
    }
  },
  "Cross River": {
    lgas: {
      "Abi": ["Abi", "Yakurr", "Obubra", "Etung"],
      "Akamkpa": ["Akamkpa", "Calabar", "Odukpani", "Boki"],
      "Akpabuyo": ["Calabar", "Akpabuyo", "Odukpani", "Biase"],
      "Bakassi": ["Bakassi", "Akpabuyo", "Calabar", "Odukpani"],
      "Bekwarra": ["Bekwarra", "Obanliku", "Obudu", "Ogoja"],
      "Biase": ["Biase", "Odukpani", "Akpabuyo", "Calabar"],
      "Boki": ["Boki", "Obanliku", "Etung", "Obudu"],
      "Calabar Municipal": ["Calabar", "Marian", "Nassarawa", "Diamond"],
      "Calabar South": ["Calabar", "Nsefik", "Ekorinim", "Henshaw Town"],
      "Etung": ["Etung", "Abi", "Boki", "Obanliku"],
      "Ikom": ["Ikom", "Etung", "Boki", "Yala"],
      "Obanliku": ["Obanliku", "Bekwarra", "Obudu", "Boki"],
      "Obubra": ["Obubra", "Abi", "Yakurr", "Etung"],
      "Obudu": ["Obudu", "Bekwarra", "Obanliku", "Boki"],
      "Odukpani": ["Odukpani", "Calabar", "Akpabuyo", "Biase"],
      "Ogoja": ["Ogoja", "Yala", "Bekwarra", "Obanliku"],
      "Yakurr": ["Yakurr", "Abi", "Obubra", "Etung"],
      "Yala": ["Yala", "Ogoja", "Bekwarra", "Ikom"]
    }
  },
  "Delta": {
    lgas: {
      "Aniocha North": ["Issele-Uku", "Ogwashi-Uku", "Ubulu-Uku", "Onicha-Olona"],
      "Aniocha South": ["Ogwashi-Uku", "Ubulu-Uku", "Issele-Uku", "Asaba"],
      "Bomadi": ["Bomadi", "Burutu", "Patani", "Ughelli"],
      "Burutu": ["Burutu", "Patani", "Bomadi", "Ughelli"],
      "Ethiope East": ["Abraka", "Oghareki", "Oria", "Asaba"],
      "Ethiope West": ["Oghara", "Eku", "Mosogar", "Abraka"],
      "Ika North East": ["Agbor", "Abavo", "Owhelogbo", "Ute-Okpu"],
      "Ika South": ["Agbor", "Owa-Oyibu", "Owa-Alero", "Abavo"],
      "Isoko North": ["Oleh", "Ozoro", "Emevor", "Aviara"],
      "Isoko South": ["Oleh", "Ozoro", "Emevor", "Emede"],
      "Ndokwa East": ["Ashaka", "Ase", "Kwale", "Abbi"],
      "Ndokwa West": ["Kwale", "Abbi", "Ashaka", "Aboh"],
      "Okpe": ["Sapele", "Ugolo", "Mosogar", "Oghara"],
      "Oshimili North": ["Asaba", "Ibusa", "Oko", "Ogwashi-Uku"],
      "Oshimili South": ["Asaba", "Ibusa", "Oko", "Ogwashi-Uku"],
      "Patani": ["Patani", "Burutu", "Bomadi", "Ughelli"],
      "Sapele": ["Sapele", "Ogorode", "Amukpe", "Ugboro"],
      "Udu": ["Udu", "Warri", "Uvwie", "Effurun"],
      "Ughelli North": ["Ughelli", "Orogun", "Otu-Jeremi", "Agbarho"],
      "Ughelli South": ["Ughelli", "Orogun", "Otu-Jeremi", "Agbarho"],
      "Ukwuani": ["Kwale", "Abbi", "Ashaka", "Aboh"],
      "Uvwie": ["Effurun", "Warri", "Udu", "Uvwie"],
      "Warri North": ["Warri", "Koko", "Sapele", "Burutu"],
      "Warri South": ["Warri", "Effurun", "Udu", "Uvwie"],
      "Warri South West": ["Warri", "Burutu", "Sapele", "Koko"]
    }
  },
  "Ebonyi": {
    lgas: {
      "Abakaliki": ["Abakaliki", "Kpirikpiri", "Nkwagu", "Amasiri"],
      "Afikpo North": ["Afikpo", "Isu", "Mgbo", "Edda"],
      "Afikpo South": ["Afikpo", "Isu", "Mgbo", "Edda"],
      "Ebonyi": ["Ebonyi", "Abakaliki", "Nkwagu", "Amasiri"],
      "Ezza North": ["Ezza", "Abakaliki", "Nkwagu", "Amasiri"],
      "Ezza South": ["Ezza", "Abakaliki", "Nkwagu", "Amasiri"],
      "Ikwo": ["Ikwo", "Abakaliki", "Nkwagu", "Amasiri"],
      "Ishielu": ["Ishielu", "Abakaliki", "Nkwagu", "Amasiri"],
      "Ivo": ["Ivo", "Afikpo", "Isu", "Mgbo"],
      "Izzi": ["Izzi", "Abakaliki", "Nkwagu", "Amasiri"],
      "Ohaozara": ["Ohaozara", "Afikpo", "Isu", "Mgbo"],
      "Ohaukwu": ["Ohaukwu", "Abakaliki", "Nkwagu", "Amasiri"],
      "Onicha": ["Onicha", "Afikpo", "Isu", "Mgbo"]
    }
  },
  "Edo": {
    lgas: {
      "Akoko-Edo": ["Akoko-Edo", "Benin City", "Etsako", "Owan"],
      "Egor": ["Benin City", "Egor", "Ikpoba-Okha", "Ovia"],
      "Esan Central": ["Irrua", "Uromi", "Esan", "Benin City"],
      "Esan North East": ["Uromi", "Irrua", "Esan", "Benin City"],
      "Esan South East": ["Ubiaja", "Esan", "Irrua", "Benin City"],
      "Esan West": ["Ekpoma", "Esan", "Irrua", "Benin City"],
      "Etsako Central": ["Auchi", "Etsako", "Akoko-Edo", "Owan"],
      "Etsako East": ["Auchi", "Etsako", "Akoko-Edo", "Owan"],
      "Etsako West": ["Auchi", "Fugar", "Etsako", "Akoko-Edo"],
      "Igueben": ["Igueben", "Ekpoma", "Esan", "Benin City"],
      "Ikpoba-Okha": ["Benin City", "Ikpoba-Okha", "Egor", "Ovia"],
      "Orhionmwon": ["Benin City", "Orhionmwon", "Ovia", "Egor"],
      "Oredo": ["Benin City", "GRA", "Ring Road", "Sapele Road"],
      "Ovia North East": ["Iguosa", "Ovia", "Benin City", "Egor"],
      "Ovia South West": ["Ovia", "Iguosa", "Benin City", "Egor"],
      "Owan East": ["Owan", "Auchi", "Etsako", "Akoko-Edo"],
      "Owan West": ["Owan", "Auchi", "Etsako", "Akoko-Edo"],
      "Uhunmwonde": ["Benin City", "Uhunmwonde", "Egor", "Ikpoba-Okha"]
    }
  },
  "Ekiti": {
    lgas: {
      "Ado Ekiti": ["Ado Ekiti", "Basiri", "Ijigbo", "Oke-Ila"],
      "Efon": ["Efon-Alaaye", "Ado Ekiti", "Emure", "Ekiti"],
      "Ekiti East": ["Omuo Ekiti", "Ado Ekiti", "Ikere", "Oye"],
      "Ekiti South West": ["Aramoko", "Ado Ekiti", "Ikere", "Oye"],
      "Ekiti West": ["Aramoko", "Ado Ekiti", "Ikere", "Oye"],
      "Emure": ["Emure-Ekiti", "Ado Ekiti", "Ikere", "Oye"],
      "Gbonyin": ["Ise-Ekiti", "Ado Ekiti", "Ikere", "Oye"],
      "Ido/Osi": ["Ido-Ekiti", "Ado Ekiti", "Ikere", "Oye"],
      "Ijero": ["Ijero-Ekiti", "Ado Ekiti", "Ikere", "Oye"],
      "Ikere": ["Ikere-Ekiti", "Ado Ekiti", "Oye", "Emure"],
      "Ikole": ["Ikole-Ekiti", "Ado Ekiti", "Ikere", "Oye"],
      "Ilejemeje": ["Ilejemeje", "Ado Ekiti", "Ikere", "Oye"],
      "Irepodun/Ifelodun": ["Irepodun", "Ado Ekiti", "Ikere", "Oye"],
      "Ise/Orun": ["Ise-Ekiti", "Ado Ekiti", "Ikere", "Oye"],
      "Moba": ["Otun-Ekiti", "Ado Ekiti", "Ikere", "Oye"],
      "Oye": ["Oye-Ekiti", "Ado Ekiti", "Ikere", "Emure"]
    }
  },
  "Enugu": {
    lgas: {
      "Aninri": ["Aninri", "Awgu", "Oji River", "Udi"],
      "Awgu": ["Awgu", "Oji River", "Udi", "Enugu"],
      "Enugu East": ["Enugu", "Independence Layout", "New Haven", "Trans-Ekulu"],
      "Enugu North": ["Enugu", "Achara Layout", "Ogui", "Coal Camp"],
      "Enugu South": ["Enugu", "Asata", "Abakpa", "Nike"],
      "Ezeagu": ["Ezeagu", "Oji River", "Udi", "Enugu"],
      "Igbo Etiti": ["Igbo-Etiti", "Obollo-Afor", "Opi", "Enugu"],
      "Igbo Eze North": ["Obollo-Afor", "Enugu", "Opi", "Igbo Eze"],
      "Igbo Eze South": ["Obollo-Afor", "Enugu", "Opi", "Igbo Eze"],
      "Isi Uzo": ["Isi Uzo", "Enugu", "Opi", "Igbo Eze"],
      "Nkanu East": ["Nkanu", "Enugu", "Abakpa", "Nike"],
      "Nkanu West": ["Nkanu", "Enugu", "Abakpa", "Nike"],
      "Nsukka": ["Nsukka", "Enugu", "Opi", "Igbo Eze"],
      "Oji River": ["Oji River", "Awgu", "Udi", "Enugu"],
      "Udenu": ["Udenu", "Obollo-Afor", "Enugu", "Opi"],
      "Udi": ["Udi", "Awgu", "Oji River", "Enugu"],
      "Uzo Uwani": ["Uzo Uwani", "Enugu", "Opi", "Igbo Eze"]
    }
  },
  "FCT": {
    lgas: {
      "Abaji": ["Abaji", "Abuja", "Gwagwalada", "Kuje"],
      "Bwari": ["Bwari", "Abuja", "Gwagwalada", "Kuje"],
      "Gwagwalada": ["Gwagwalada", "Abuja", "Bwari", "Kuje"],
      "Kuje": ["Kuje", "Abuja", "Gwagwalada", "Bwari"],
      "Kwali": ["Kwali", "Abuja", "Gwagwalada", "Kuje"],
      "Municipal Area Council": ["Abuja", "Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Kubwa", "Nyanya", "Karu"]
    }
  },
  "Gombe": {
    lgas: {
      "Akko": ["Gombe", "Akko", "Nafada", "Yamaltu"],
      "Balanga": ["Balanga", "Gombe", "Nafada", "Yamaltu"],
      "Billiri": ["Billiri", "Gombe", "Nafada", "Yamaltu"],
      "Dukku": ["Dukku", "Gombe", "Nafada", "Yamaltu"],
      "Funakaye": ["Bajoga", "Gombe", "Nafada", "Yamaltu"],
      "Gombe": ["Gombe", "Deba", "Pantami", "Tumfure"],
      "Kaltungo": ["Kaltungo", "Gombe", "Nafada", "Yamaltu"],
      "Kwami": ["Kwami", "Gombe", "Nafada", "Yamaltu"],
      "Nafada": ["Nafada", "Gombe", "Dukku", "Yamaltu"],
      "Shongom": ["Shongom", "Gombe", "Nafada", "Yamaltu"],
      "Yamaltu/Deba": ["Yamaltu", "Deba", "Gombe", "Nafada"]
    }
  },
  "Imo": {
    lgas: {
      "Aboh Mbaise": ["Aboh Mbaise", "Owerri", "Mbaise", "Ahiazu"],
      "Ahiazu Mbaise": ["Ahiazu", "Owerri", "Mbaise", "Aboh"],
      "Ehime Mbano": ["Ehime Mbano", "Owerri", "Mbaise", "Ikeduru"],
      "Ezinihitte": ["Ezinihitte", "Owerri", "Mbaise", "Ahiazu"],
      "Ideato North": ["Ideato", "Orlu", "Orsu", "Imo"],
      "Ideato South": ["Ideato", "Orlu", "Orsu", "Imo"],
      "Ihitte/Uboma": ["Ihitte", "Owerri", "Mbaise", "Ikeduru"],
      "Ikeduru": ["Ikeduru", "Owerri", "Mbaise", "Aboh"],
      "Isiala Mbano": ["Isiala Mbano", "Owerri", "Mbaise", "Ikeduru"],
      "Isu": ["Isu", "Orlu", "Orsu", "Imo"],
      "Mbaitoli": ["Mbaitoli", "Owerri", "Mbaise", "Ikeduru"],
      "Ngor Okpala": ["Ngor Okpala", "Owerri", "Mbaise", "Ikeduru"],
      "Njaba": ["Njaba", "Orlu", "Orsu", "Imo"],
      "Nkwerre": ["Nkwerre", "Orlu", "Orsu", "Imo"],
      "Nwangele": ["Nwangele", "Orlu", "Orsu", "Imo"],
      "Obowo": ["Obowo", "Owerri", "Mbaise", "Ikeduru"],
      "Oguta": ["Oguta", "Owerri", "Mbaise", "Ikeduru"],
      "Ohaji/Egbema": ["Ohaji", "Owerri", "Mbaise", "Ikeduru"],
      "Okigwe": ["Okigwe", "Owerri", "Mbaise", "Ikeduru"],
      "Onuimo": ["Onuimo", "Orlu", "Orsu", "Imo"],
      "Orlu": ["Orlu", "Imo", "Orsu", "Isu"],
      "Orsu": ["Orsu", "Orlu", "Imo", "Isu"],
      "Oru East": ["Mgbidi", "Orlu", "Orsu", "Imo"],
      "Oru West": ["Oru", "Orlu", "Orsu", "Imo"],
      "Owerri Municipal": ["Owerri", "Ikenegbu", "Orji", "Aladinma"],
      "Owerri North": ["Owerri", "Ikenegbu", "Orji", "Aladinma"],
      "Owerri West": ["Owerri", "Ikenegbu", "Orji", "Aladinma"]
    }
  },
  "Jigawa": {
    lgas: {
      "Auyo": ["Auyo", "Hadejia", "Kafin Hausa", "Gumel"],
      "Babura": ["Babura", "Gumel", "Hadejia", "Dutse"],
      "Biriniwa": ["Biriniwa", "Hadejia", "Kafin Hausa", "Gumel"],
      "Birnin Kudu": ["Birnin Kudu", "Dutse", "Gwaram", "Kafin Hausa"],
      "Buji": ["Buji", "Dutse", "Gwaram", "Kafin Hausa"],
      "Dutse": ["Dutse", "Birnin Kudu", "Gwaram", "Kafin Hausa"],
      "Gagarawa": ["Gagarawa", "Hadejia", "Gumel", "Dutse"],
      "Garki": ["Garki", "Dutse", "Gwaram", "Kafin Hausa"],
      "Gumel": ["Gumel", "Hadejia", "Kafin Hausa", "Babura"],
      "Guri": ["Guri", "Hadejia", "Kafin Hausa", "Gumel"],
      "Gwaram": ["Gwaram", "Dutse", "Birnin Kudu", "Kafin Hausa"],
      "Gwiwa": ["Gwiwa", "Dutse", "Gwaram", "Kafin Hausa"],
      "Hadejia": ["Hadejia", "Gumel", "Kafin Hausa", "Dutse"],
      "Jahun": ["Jahun", "Dutse", "Gwaram", "Kafin Hausa"],
      "Kafin Hausa": ["Kafin Hausa", "Hadejia", "Gumel", "Dutse"],
      "Kaugama": ["Kaugama", "Hadejia", "Gumel", "Dutse"],
      "Kazaure": ["Kazaure", "Gumel", "Hadejia", "Dutse"],
      "Kiri Kasama": ["Kiri Kasama", "Hadejia", "Gumel", "Dutse"],
      "Kiyawa": ["Kiyawa", "Dutse", "Gwaram", "Kafin Hausa"],
      "Maigatari": ["Maigatari", "Hadejia", "Gumel", "Dutse"],
      "Malam Madori": ["Malam Madori", "Hadejia", "Gumel", "Dutse"],
      "Miga": ["Miga", "Dutse", "Gwaram", "Kafin Hausa"],
      "Ringim": ["Ringim", "Dutse", "Gwaram", "Kafin Hausa"],
      "Roni": ["Roni", "Dutse", "Gwaram", "Kafin Hausa"],
      "Sule Tankarkar": ["Sule Tankarkar", "Dutse", "Gwaram", "Kafin Hausa"],
      "Taura": ["Taura", "Dutse", "Gwaram", "Kafin Hausa"],
      "Yankwashi": ["Yankwashi", "Dutse", "Gwaram", "Kafin Hausa"]
    }
  },
  "Kaduna": {
    lgas: {
      "Birnin Gwari": ["Birnin Gwari", "Kaduna", "Zaria", "Soba"],
      "Chikun": ["Kaduna", "Chikun", "Zaria", "Igabi"],
      "Giwa": ["Giwa", "Zaria", "Kaduna", "Igabi"],
      "Igabi": ["Kaduna", "Igabi", "Zaria", "Chikun"],
      "Ikara": ["Ikara", "Zaria", "Kaduna", "Kubau"],
      "Jaba": ["Jaba", "Kaduna", "Zaria", "Jema'a"],
      "Jema'a": ["Kafanchan", "Jema'a", "Kaduna", "Jaba"],
      "Kachia": ["Kachia", "Kaduna", "Zaria", "Chikun"],
      "Kaduna North": ["Kaduna", "Rigasa", "Ungwan Rimi", "Badiko"],
      "Kaduna South": ["Kaduna", "Tudun Wada", "Kabala", "Television"],
      "Kagarko": ["Kagarko", "Kaduna", "Zaria", "Kachia"],
      "Kajuru": ["Kajuru", "Kaduna", "Zaria", "Chikun"],
      "Kaura": ["Kaura", "Kaduna", "Zaria", "Jema'a"],
      "Kauru": ["Kauru", "Zaria", "Kaduna", "Kubau"],
      "Kubau": ["Kubau", "Zaria", "Kaduna", "Kauru"],
      "Kudan": ["Kudan", "Zaria", "Kaduna", "Giwa"],
      "Lere": ["Lere", "Kaduna", "Zaria", "Kachia"],
      "Makarfi": ["Makarfi", "Zaria", "Kaduna", "Kubau"],
      "Sabon Gari": ["Zaria", "Sabon Gari", "Kaduna", "Giwa"],
      "Sanga": ["Sanga", "Kaduna", "Zaria", "Jema'a"],
      "Soba": ["Soba", "Zaria", "Kaduna", "Kubau"],
      "Zangon Kataf": ["Zangon Kataf", "Kaduna", "Zaria", "Jema'a"],
      "Zaria": ["Zaria", "Sabon Gari", "Tudun Wada", "Kwarbai"]
    }
  },
  "Kano": {
    lgas: {
      "Ajingi": ["Ajingi", "Kano", "Wudil", "Gaya"],
      "Albasu": ["Albasu", "Kano", "Wudil", "Gaya"],
      "Bagwai": ["Bagwai", "Kano", "Wudil", "Gaya"],
      "Bebeji": ["Bebeji", "Kano", "Wudil", "Gaya"],
      "Bichi": ["Bichi", "Kano", "Gwarzo", "Wudil"],
      "Bunkure": ["Bunkure", "Kano", "Wudil", "Gaya"],
      "Dala": ["Kano", "Dala", "Gwale", "Municipal"],
      "Dambatta": ["Dambatta", "Kano", "Gwarzo", "Shanono"],
      "Dawakin Kudu": ["Kano", "Dawakin Kudu", "Tarauni", "Municipal"],
      "Dawakin Tofa": ["Kano", "Dawakin Tofa", "Tofa", "Gwarzo"],
      "Doguwa": ["Doguwa", "Kano", "Wudil", "Gaya"],
      "Fagge": ["Kano", "Fagge", "Municipal", "Gwale"],
      "Gabasawa": ["Gabasawa", "Kano", "Wudil", "Gaya"],
      "Garko": ["Garko", "Kano", "Wudil", "Gaya"],
      "Garun Mallam": ["Garun Mallam", "Kano", "Wudil", "Gaya"],
      "Gaya": ["Gaya", "Kano", "Wudil", "Albasu"],
      "Gezawa": ["Gezawa", "Kano", "Wudil", "Gaya"],
      "Gwale": ["Kano", "Gwale", "Municipal", "Nasarawa"],
      "Gwarzo": ["Gwarzo", "Kano", "Bichi", "Shanono"],
      "Kabo": ["Kabo", "Kano", "Gwarzo", "Shanono"],
      "Kano Municipal": ["Kano", "Sabon Gari", "Bompai", "Zoo Road"],
      "Karaye": ["Karaye", "Kano", "Gwarzo", "Shanono"],
      "Kibiya": ["Kibiya", "Kano", "Wudil", "Gaya"],
      "Kiru": ["Kiru", "Kano", "Gwarzo", "Shanono"],
      "Kumbotso": ["Kano", "Kumbotso", "Municipal", "Nasarawa"],
      "Kunchi": ["Kunchi", "Kano", "Gwarzo", "Shanono"],
      "Kura": ["Kura", "Kano", "Wudil", "Gaya"],
      "Madobi": ["Madobi", "Kano", "Wudil", "Gaya"],
      "Makoda": ["Makoda", "Kano", "Gwarzo", "Shanono"],
      "Minjibir": ["Minjibir", "Kano", "Wudil", "Gaya"],
      "Nasarawa": ["Kano", "Nasarawa", "Municipal", "Gwale"],
      "Rano": ["Rano", "Kano", "Wudil", "Gaya"],
      "Rimin Gado": ["Rimin Gado", "Kano", "Gwarzo", "Shanono"],
      "Rogo": ["Rogo", "Kano", "Wudil", "Gaya"],
      "Shanono": ["Shanono", "Kano", "Gwarzo", "Bichi"],
      "Sumaila": ["Sumaila", "Kano", "Wudil", "Gaya"],
      "Takai": ["Takai", "Kano", "Wudil", "Gaya"],
      "Tarauni": ["Kano", "Tarauni", "Municipal", "Nasarawa"],
      "Tofa": ["Tofa", "Kano", "Gwarzo", "Shanono"],
      "Tsanyawa": ["Tsanyawa", "Kano", "Gwarzo", "Shanono"],
      "Tudun Wada": ["Kano", "Tudun Wada", "Municipal", "Nasarawa"],
      "Ungogo": ["Kano", "Ungogo", "Municipal", "Nasarawa"],
      "Warawa": ["Warawa", "Kano", "Wudil", "Gaya"],
      "Wudil": ["Wudil", "Kano", "Gaya", "Albasu"]
    }
  },
  "Katsina": {
    lgas: {
      "Bakori": ["Bakori", "Katsina", "Funtua", "Malumfashi"],
      "Batagarawa": ["Batagarawa", "Katsina", "Funtua", "Malumfashi"],
      "Batsari": ["Batsari", "Katsina", "Funtua", "Malumfashi"],
      "Baure": ["Baure", "Katsina", "Funtua", "Malumfashi"],
      "Bindawa": ["Bindawa", "Katsina", "Funtua", "Malumfashi"],
      "Charanchi": ["Charanchi", "Katsina", "Funtua", "Malumfashi"],
      "Dan Musa": ["Dan Musa", "Katsina", "Funtua", "Malumfashi"],
      "Dandume": ["Dandume", "Katsina", "Funtua", "Malumfashi"],
      "Danja": ["Danja", "Katsina", "Funtua", "Malumfashi"],
      "Daura": ["Daura", "Katsina", "Funtua", "Malumfashi"],
      "Dutsi": ["Dutsi", "Katsina", "Funtua", "Malumfashi"],
      "Dutsin-Ma": ["Dutsin-Ma", "Katsina", "Funtua", "Malumfashi"],
      "Faskari": ["Faskari", "Katsina", "Funtua", "Malumfashi"],
      "Funtua": ["Funtua", "Katsina", "Bakori", "Malumfashi"],
      "Ingawa": ["Ingawa", "Katsina", "Funtua", "Malumfashi"],
      "Jibia": ["Jibia", "Katsina", "Funtua", "Malumfashi"],
      "Kafur": ["Kafur", "Katsina", "Funtua", "Malumfashi"],
      "Kaita": ["Kaita", "Katsina", "Funtua", "Malumfashi"],
      "Kankara": ["Kankara", "Katsina", "Funtua", "Malumfashi"],
      "Kankia": ["Kankia", "Katsina", "Funtua", "Malumfashi"],
      "Katsina": ["Katsina", "Jibia", "Daura", "Funtua"],
      "Kurfi": ["Kurfi", "Katsina", "Funtua", "Malumfashi"],
      "Kusada": ["Kusada", "Katsina", "Funtua", "Malumfashi"],
      "Mai'Adua": ["Mai'Adua", "Katsina", "Funtua", "Malumfashi"],
      "Malumfashi": ["Malumfashi", "Katsina", "Funtua", "Bakori"],
      "Mani": ["Mani", "Katsina", "Funtua", "Malumfashi"],
      "Mashi": ["Mashi", "Katsina", "Funtua", "Malumfashi"],
      "Matazu": ["Matazu", "Katsina", "Funtua", "Malumfashi"],
      "Musawa": ["Musawa", "Katsina", "Funtua", "Malumfashi"],
      "Rimi": ["Rimi", "Katsina", "Funtua", "Malumfashi"],
      "Sabuwa": ["Sabuwa", "Katsina", "Funtua", "Malumfashi"],
      "Safana": ["Safana", "Katsina", "Funtua", "Malumfashi"],
      "Sandamu": ["Sandamu", "Katsina", "Funtua", "Malumfashi"],
      "Zango": ["Zango", "Katsina", "Funtua", "Malumfashi"]
    }
  },
  "Kebbi": {
    lgas: {
      "Aleiro": ["Aleiro", "Birnin Kebbi", "Argungu", "Yauri"],
      "Arewa Dandi": ["Arewa Dandi", "Birnin Kebbi", "Argungu", "Yauri"],
      "Argungu": ["Argungu", "Birnin Kebbi", "Yauri", "Koko"],
      "Augie": ["Augie", "Birnin Kebbi", "Argungu", "Yauri"],
      "Bagudo": ["Bagudo", "Birnin Kebbi", "Argungu", "Yauri"],
      "Birnin Kebbi": ["Birnin Kebbi", "Argungu", "Yauri", "Koko"],
      "Bunza": ["Bunza", "Birnin Kebbi", "Argungu", "Yauri"],
      "Dandi": ["Dandi", "Birnin Kebbi", "Argungu", "Yauri"],
      "Fakai": ["Fakai", "Birnin Kebbi", "Argungu", "Yauri"],
      "Gwandu": ["Gwandu", "Birnin Kebbi", "Argungu", "Yauri"],
      "Jega": ["Jega", "Birnin Kebbi", "Argungu", "Yauri"],
      "Kalgo": ["Kalgo", "Birnin Kebbi", "Argungu", "Yauri"],
      "Koko/Besse": ["Koko", "Birnin Kebbi", "Argungu", "Yauri"],
      "Maiyama": ["Maiyama", "Birnin Kebbi", "Argungu", "Yauri"],
      "Ngaski": ["Ngaski", "Birnin Kebbi", "Argungu", "Yauri"],
      "Sakaba": ["Sakaba", "Birnin Kebbi", "Argungu", "Yauri"],
      "Shanga": ["Shanga", "Birnin Kebbi", "Argungu", "Yauri"],
      "Suru": ["Suru", "Birnin Kebbi", "Argungu", "Yauri"],
      "Wasagu/Danko": ["Wasagu", "Birnin Kebbi", "Argungu", "Yauri"],
      "Yauri": ["Yauri", "Birnin Kebbi", "Argungu", "Koko"],
      "Zuru": ["Zuru", "Birnin Kebbi", "Argungu", "Yauri"]
    }
  },
  "Kogi": {
    lgas: {
      "Adavi": ["Adavi", "Okene", "Ogori-Magongo", "Okehi"],
      "Ajaokuta": ["Ajaokuta", "Lokoja", "Kogi", "Ogori-Magongo"],
      "Ankpa": ["Ankpa", "Lokoja", "Kogi", "Ofu"],
      "Bassa": ["Bassa", "Lokoja", "Kogi", "Ajaokuta"],
      "Dekina": ["Dekina", "Lokoja", "Kogi", "Ofu"],
      "Ibaji": ["Ibaji", "Lokoja", "Kogi", "Idah"],
      "Idah": ["Idah", "Lokoja", "Kogi", "Ofu"],
      "Igalamela-Odolu": ["Ajaka", "Lokoja", "Kogi", "Idah"],
      "Ijumu": ["Ijumu", "Lokoja", "Kogi", "Okehi"],
      "Kabba/Bunu": ["Kabba", "Lokoja", "Kogi", "Okehi"],
      "Kogi": ["Lokoja", "Kogi", "Ajaokuta", "Ankpa"],
      "Lokoja": ["Lokoja", "Adankolo", "Gangare", "Old GRA"],
      "Mopa-Muro": ["Mopa", "Lokoja", "Kogi", "Okehi"],
      "Ofu": ["Ofu", "Lokoja", "Kogi", "Idah"],
      "Ogori/Magongo": ["Ogori", "Lokoja", "Kogi", "Okehi"],
      "Okehi": ["Okehi", "Okene", "Lokoja", "Kogi"],
      "Okene": ["Okene", "Lokoja", "Kogi", "Okehi"],
      "Olamaboro": ["Olamaboro", "Lokoja", "Kogi", "Idah"],
      "Omala": ["Omala", "Lokoja", "Kogi", "Ofu"],
      "Yagba East": ["Egbe", "Lokoja", "Kogi", "Okehi"],
      "Yagba West": ["Ogbe", "Lokoja", "Kogi", "Okehi"]
    }
  },
  "Kwara": {
    lgas: {
      "Asa": ["Asa", "Ilorin", "Offa", "Isin"],
      "Baruten": ["Baruten", "Ilorin", "Offa", "Isin"],
      "Edu": ["Edu", "Ilorin", "Offa", "Isin"],
      "Ekiti": ["Ekiti", "Ilorin", "Offa", "Isin"],
      "Ifelodun": ["Ifelodun", "Ilorin", "Offa", "Isin"],
      "Ilorin East": ["Ilorin", "Ilorin East", "Offa", "Asa"],
      "Ilorin South": ["Ilorin", "Ilorin South", "Offa", "Asa"],
      "Ilorin West": ["Ilorin", "Ilorin West", "Offa", "Asa"],
      "Irepodun": ["Irepodun", "Ilorin", "Offa", "Isin"],
      "Isin": ["Isin", "Ilorin", "Offa", "Ekiti"],
      "Kaiama": ["Kaiama", "Ilorin", "Offa", "Isin"],
      "Moro": ["Moro", "Ilorin", "Offa", "Isin"],
      "Offa": ["Offa", "Ilorin", "Asa", "Isin"],
      "Oke Ero": ["Oke Ero", "Ilorin", "Offa", "Isin"],
      "Oyun": ["Oyun", "Ilorin", "Offa", "Isin"],
      "Patigi": ["Patigi", "Ilorin", "Offa", "Isin"]
    }
  },
  "Lagos": {
    lgas: {
      "Agege": ["Agege", "Oke-Odo", "Alimosho", "Ikeja"],
      "Ajeromi-Ifelodun": ["Ajegunle", "Amukoko", "Olodi-Apapa", "Ifelodun"],
      "Alimosho": ["Alimosho", "Egbeda", "Ipaja", "Agbado"],
      "Amuwo-Odofin": ["Festac Town", "Mile 2", "Kirikiri", "Satellite Town"],
      "Apapa": ["Apapa", "Iganmu", "Sari-Iganmu", "Olodi"],
      "Badagry": ["Badagry", "Ajara", "Ganyingbo", "Topo"],
      "Epe": ["Epe", "Ejinrin", "Ijebu Ode", "Ketu"],
      "Eti-Osa": ["Victoria Island", "Lekki", "Ajah", "Eti-Osa"],
      "Ibeju-Lekki": ["Ibeju", "Lekki", "Ibeju-Lekki", "Etan"],
      "Ifako-Ijaiye": ["Ifako", "Ijaiye", "Ogba", "Agege"],
      "Ikeja": ["Ikeja", "GRA", "Allen Avenue", "Maryland"],
      "Ikorodu": ["Ikorodu", "Imota", "Ijede", "Igbogbo"],
      "Kosofe": ["Kosofe", "Ketu", "Ojota", "Ikosi"],
      "Lagos Island": ["Lagos Island", "Isale-Eko", "Marina", "Idumota"],
      "Lagos Mainland": ["Ebute Meta", "Yaba", "Surulere", "Mushin"],
      "Mushin": ["Mushin", "Idi-Araba", "Ojuwoye", "Eric Moore"],
      "Ojo": ["Ojo", "Iba", "Igbo Elerin", "Ijanikin"],
      "Oshodi-Isolo": ["Oshodi", "Isolo", "Mafoluku", "Ejigbo"],
      "Shomolu": ["Shomolu", "Bariga", "Onipanu", "Fadeyi"],
      "Somolu": ["Somolu", "Bariga", "Onipanu", "Fadeyi"],
      "Surulere": ["Surulere", "Bode Thomas", "Ojuelegba", "Aguda"]
    }
  },
  "Nasarawa": {
    lgas: {
      "Akwanga": ["Akwanga", "Lafia", "Keffi", "Nasarawa"],
      "Awe": ["Awe", "Lafia", "Keffi", "Nasarawa"],
      "Doma": ["Doma", "Lafia", "Keffi", "Nasarawa"],
      "Karu": ["Karu", "Keffi", "Nasarawa", "Lafia"],
      "Keana": ["Keana", "Lafia", "Keffi", "Nasarawa"],
      "Keffi": ["Keffi", "Nasarawa", "Lafia", "Akwanga"],
      "Kokona": ["Kokona", "Nasarawa", "Lafia", "Keffi"],
      "Lafia": ["Lafia", "Keffi", "Nasarawa", "Akwanga"],
      "Nasarawa": ["Nasarawa", "Lafia", "Keffi", "Akwanga"],
      "Nasarawa Egon": ["Nasarawa Egon", "Lafia", "Keffi", "Nasarawa"],
      "Obi": ["Obi", "Lafia", "Keffi", "Nasarawa"],
      "Toto": ["Toto", "Nasarawa", "Lafia", "Keffi"],
      "Wamba": ["Wamba", "Lafia", "Keffi", "Nasarawa"]
    }
  },
  "Niger": {
    lgas: {
      "Agaie": ["Agaie", "Bida", "Minna", "Kontagora"],
      "Agwara": ["Agwara", "Bida", "Minna", "Kontagora"],
      "Bida": ["Bida", "Agaie", "Lapai", "Minna"],
      "Borgu": ["Borgu", "Kontagora", "Minna", "Bida"],
      "Bosso": ["Minna", "Bosso", "Chanchaga", "Kontagora"],
      "Chanchaga": ["Minna", "Chanchaga", "Bosso", "Kontagora"],
      "Edati": ["Edati", "Bida", "Minna", "Kontagora"],
      "Gbako": ["Gbako", "Bida", "Minna", "Kontagora"],
      "Gurara": ["Gurara", "Minna", "Bida", "Kontagora"],
      "Katcha": ["Katcha", "Bida", "Minna", "Kontagora"],
      "Kontagora": ["Kontagora", "Minna", "Bida", "Borgu"],
      "Lapai": ["Lapai", "Bida", "Minna", "Agaie"],
      "Lavun": ["Lavun", "Bida", "Minna", "Kontagora"],
      "Magama": ["Magama", "Minna", "Bida", "Kontagora"],
      "Mariga": ["Mariga", "Minna", "Bida", "Kontagora"],
      "Mashegu": ["Mashegu", "Minna", "Bida", "Kontagora"],
      "Mokwa": ["Mokwa", "Minna", "Bida", "Kontagora"],
      "Moya": ["Moya", "Minna", "Bida", "Kontagora"],
      "Paikoro": ["Paikoro", "Minna", "Bida", "Kontagora"],
      "Rafi": ["Rafi", "Minna", "Bida", "Kontagora"],
      "Rijau": ["Rijau", "Minna", "Bida", "Kontagora"],
      "Shiroro": ["Shiroro", "Minna", "Bida", "Kontagora"],
      "Suleja": ["Suleja", "Minna", "Bida", "Kontagora"],
      "Tafa": ["Tafa", "Minna", "Bida", "Kontagora"],
      "Wushishi": ["Wushishi", "Minna", "Bida", "Kontagora"]
    }
  },
  "Ogun": {
    lgas: {
      "Abeokuta North": ["Abeokuta", "Itoku", "Iberekodo", "Oke-Lantoro"],
      "Abeokuta South": ["Abeokuta", "Oke-Ilewo", "Isale-Igbehin", "Adatan"],
      "Ado-Odo/Ota": ["Ota", "Ado-Odo", "Agbara", "Sango-Ota"],
      "Egbado North": ["Ilaro", "Egbado", "Ado-Odo", "Imeko"],
      "Egbado South": ["Ilaro", "Egbado", "Ado-Odo", "Agbara"],
      "Ewekoro": ["Ewekoro", "Abeokuta", "Ifo", "Obafemi-Owode"],
      "Ifo": ["Ifo", "Abeokuta", "Ado-Odo", "Obafemi-Owode"],
      "Ijebu East": ["Ijebu East", "Ijebu Ode", "Ogun", "Sagamu"],
      "Ijebu North": ["Ijebu North", "Ijebu Ode", "Ogun", "Sagamu"],
      "Ijebu North East": ["Ijebu North East", "Ijebu Ode", "Ogun", "Sagamu"],
      "Ijebu Ode": ["Ijebu Ode", "Sagamu", "Abeokuta", "Ogun"],
      "Ikenne": ["Ikenne", "Sagamu", "Ijebu Ode", "Ogun"],
      "Imeko Afon": ["Imeko", "Abeokuta", "Egbado", "Ado-Odo"],
      "Ipokia": ["Ipokia", "Abeokuta", "Ado-Odo", "Agbara"],
      "Obafemi Owode": ["Owode", "Abeokuta", "Ifo", "Sagamu"],
      "Odeda": ["Odeda", "Abeokuta", "Ewekoro", "Ifo"],
      "Odogbolu": ["Odogbolu", "Sagamu", "Ijebu Ode", "Ogun"],
      "Ogun Waterside": ["Ogun Waterside", "Sagamu", "Ijebu Ode", "Ogun"],
      "Remo North": ["Remo North", "Sagamu", "Ijebu Ode", "Ogun"],
      "Shagamu": ["Sagamu", "Ikenne", "Ijebu Ode", "Ogun"]
    }
  },
  "Ondo": {
    lgas: {
      "Akoko North East": ["Akoko North East", "Akure", "Ondo", "Owo"],
      "Akoko North West": ["Akoko North West", "Akure", "Ondo", "Owo"],
      "Akoko South East": ["Akoko South East", "Akure", "Ondo", "Owo"],
      "Akoko South West": ["Oka Akoko", "Akure", "Ondo", "Owo"],
      "Akure North": ["Akure", "Akure North", "Ondo", "Owo"],
      "Akure South": ["Akure", "Akure South", "Ondo", "Owo"],
      "Ese Odo": ["Ese Odo", "Akure", "Ondo", "Owo"],
      "Idanre": ["Idanre", "Akure", "Ondo", "Owo"],
      "Ifedore": ["Ifedore", "Akure", "Ondo", "Owo"],
      "Ilaje": ["Igbokoda", "Akure", "Ondo", "Owo"],
      "Ile Oluji/Okeigbo": ["Ile Oluji", "Akure", "Ondo", "Owo"],
      "Irele": ["Irele", "Akure", "Ondo", "Owo"],
      "Odigbo": ["Odigbo", "Akure", "Ondo", "Owo"],
      "Okitipupa": ["Okitipupa", "Akure", "Ondo", "Owo"],
      "Ondo East": ["Ondo", "Akure", "Owo", "Odigbo"],
      "Ondo West": ["Ondo", "Akure", "Owo", "Odigbo"],
      "Ose": ["Ose", "Akure", "Ondo", "Owo"],
      "Owo": ["Owo", "Akure", "Ondo", "Odigbo"]
    }
  },
  "Osun": {
    lgas: {
      "Atakumosa East": ["Atakumosa East", "Osogbo", "Ile-Ife", "Ilesha"],
      "Atakumosa West": ["Atakumosa West", "Osogbo", "Ile-Ife", "Ilesha"],
      "Aiyedaade": ["Osogbo", "Ile-Ife", "Ilesha", "Aiyedaade"],
      "Aiyedire": ["Osogbo", "Ile-Ife", "Ilesha", "Aiyedire"],
      "Boluwaduro": ["Osogbo", "Ile-Ife", "Ilesha", "Boluwaduro"],
      "Boripe": ["Osogbo", "Ile-Ife", "Ilesha", "Boripe"],
      "Ede North": ["Ede", "Osogbo", "Ile-Ife", "Ilesha"],
      "Ede South": ["Ede", "Osogbo", "Ile-Ife", "Ilesha"],
      "Egbedore": ["Osogbo", "Ile-Ife", "Ilesha", "Egbedore"],
      "Ejigbo": ["Ejigbo", "Osogbo", "Ile-Ife", "Ilesha"],
      "Ife Central": ["Ile-Ife", "Osogbo", "Ilesha", "Ife"],
      "Ife East": ["Ile-Ife", "Osogbo", "Ilesha", "Ife"],
      "Ife North": ["Ile-Ife", "Osogbo", "Ilesha", "Ife"],
      "Ife South": ["Ile-Ife", "Osogbo", "Ilesha", "Ife"],
      "Ifedayo": ["Osogbo", "Ile-Ife", "Ilesha", "Ifedayo"],
      "Ifelodun": ["Osogbo", "Ile-Ife", "Ilesha", "Ifelodun"],
      "Ila": ["Ila Orangun", "Osogbo", "Ile-Ife", "Ilesha"],
      "Ilesa East": ["Ilesha", "Osogbo", "Ile-Ife", "Ilesa"],
      "Ilesa West": ["Ilesha", "Osogbo", "Ile-Ife", "Ilesa"],
      "Irepodun": ["Osogbo", "Ile-Ife", "Ilesha", "Irepodun"],
      "Irewole": ["Osogbo", "Ile-Ife", "Ilesha", "Irewole"],
      "Isokan": ["Osogbo", "Ile-Ife", "Ilesha", "Isokan"],
      "Iwo": ["Iwo", "Osogbo", "Ile-Ife", "Ilesha"],
      "Obokun": ["Osogbo", "Ile-Ife", "Ilesha", "Obokun"],
      "Odo Otin": ["Osogbo", "Ile-Ife", "Ilesha", "Odo Otin"],
      "Ola Oluwa": ["Osogbo", "Ile-Ife", "Ilesha", "Ola Oluwa"],
      "Olorunda": ["Osogbo", "Ile-Ife", "Ilesha", "Olorunda"],
      "Oriade": ["Osogbo", "Ile-Ife", "Ilesha", "Oriade"],
      "Orolu": ["Osogbo", "Ile-Ife", "Ilesha", "Orolu"],
      "Osogbo": ["Osogbo", "Ile-Ife", "Ilesha", "Olorunda"]
    }
  },
  "Oyo": {
    lgas: {
      "Afijio": ["Afijio", "Ibadan", "Oyo", "Ogbomoso"],
      "Akinyele": ["Akinyele", "Ibadan", "Oyo", "Ogbomoso"],
      "Atiba": ["Oyo", "Ibadan", "Ogbomoso", "Atiba"],
      "Atisbo": ["Atisbo", "Ibadan", "Oyo", "Ogbomoso"],
      "Egbeda": ["Egbeda", "Ibadan", "Oyo", "Ogbomoso"],
      "Ibadan North": ["Ibadan", "Agodi", "Mokola", "Oke-Ado"],
      "Ibadan North East": ["Ibadan", "Ring Road", "Bodija", "Challenge"],
      "Ibadan North West": ["Ibadan", "Oke-Ado", "Mokola", "Agodi"],
      "Ibadan South East": ["Ibadan", "Iyaganku", "Bashorun", "Agodi"],
      "Ibadan South West": ["Ibadan", "Iyaganku", "Ring Road", "Bashorun"],
      "Ibarapa Central": ["Igbo-Ora", "Ibadan", "Oyo", "Ogbomoso"],
      "Ibarapa East": ["Eruwa", "Ibadan", "Oyo", "Ogbomoso"],
      "Ibarapa North": ["Tede", "Ibadan", "Oyo", "Ogbomoso"],
      "Ido": ["Ido", "Ibadan", "Oyo", "Ogbomoso"],
      "Irepo": ["Irepo", "Ibadan", "Oyo", "Ogbomoso"],
      "Iseyin": ["Iseyin", "Ibadan", "Oyo", "Ogbomoso"],
      "Itesiwaju": ["Itesiwaju", "Ibadan", "Oyo", "Ogbomoso"],
      "Iwajowa": ["Iwajowa", "Ibadan", "Oyo", "Ogbomoso"],
      "Kajola": ["Kajola", "Ibadan", "Oyo", "Ogbomoso"],
      "Lagelu": ["Lagelu", "Ibadan", "Oyo", "Ogbomoso"],
      "Ogbomoso North": ["Ogbomoso", "Ibadan", "Oyo", "Ogbomosho"],
      "Ogbomoso South": ["Ogbomoso", "Ibadan", "Oyo", "Ogbomosho"],
      "Ogo Oluwa": ["Ogo Oluwa", "Ibadan", "Oyo", "Ogbomoso"],
      "Olorunsogo": ["Olorunsogo", "Ibadan", "Oyo", "Ogbomoso"],
      "Oluyole": ["Oluyole", "Ibadan", "Oyo", "Ogbomoso"],
      "Ona Ara": ["Ona Ara", "Ibadan", "Oyo", "Ogbomoso"],
      "Orelope": ["Orelope", "Ibadan", "Oyo", "Ogbomoso"],
      "Ori Ire": ["Ori Ire", "Ibadan", "Oyo", "Ogbomoso"],
      "Oyo East": ["Oyo", "Ibadan", "Ogbomoso", "Oyo East"],
      "Oyo West": ["Oyo", "Ibadan", "Ogbomoso", "Oyo West"],
      "Saki East": ["Saki", "Ibadan", "Oyo", "Ogbomoso"],
      "Saki West": ["Saki", "Ibadan", "Oyo", "Ogbomoso"],
      "Surulere": ["Surulere", "Ibadan", "Oyo", "Ogbomoso"]
    }
  },
  "Plateau": {
    lgas: {
      "Barkin Ladi": ["Barkin Ladi", "Jos", "Pankshin", "Shendam"],
      "Bassa": ["Bassa", "Jos", "Pankshin", "Shendam"],
      "Bokkos": ["Bokkos", "Jos", "Pankshin", "Shendam"],
      "Jos East": ["Jos", "Rayfield", "Bukuru", "Vom"],
      "Jos North": ["Jos", "Bauchi Road", "Terminus", "Farin Gada"],
      "Jos South": ["Bukuru", "Rantya", "Gyel", "Kuru"],
      "Kanam": ["Kanam", "Jos", "Pankshin", "Shendam"],
      "Kanke": ["Kanke", "Jos", "Pankshin", "Shendam"],
      "Langtang North": ["Langtang", "Jos", "Pankshin", "Shendam"],
      "Langtang South": ["Langtang", "Jos", "Pankshin", "Shendam"],
      "Mangu": ["Mangu", "Jos", "Pankshin", "Shendam"],
      "Mikang": ["Mikang", "Jos", "Pankshin", "Shendam"],
      "Pankshin": ["Pankshin", "Jos", "Shendam", "Bokkos"],
      "Qua'an Pan": ["Qua'an Pan", "Jos", "Pankshin", "Shendam"],
      "Riyom": ["Riyom", "Jos", "Pankshin", "Shendam"],
      "Shendam": ["Shendam", "Jos", "Pankshin", "Kanam"],
      "Wase": ["Wase", "Jos", "Pankshin", "Shendam"]
    }
  },
  "Rivers": {
    lgas: {
      "Abua/Odual": ["Abua", "Odual", "Port Harcourt", "Ahoada"],
      "Ahoada East": ["Ahoada", "Port Harcourt", "Abua", "Odual"],
      "Ahoada West": ["Ahoada", "Port Harcourt", "Abua", "Odual"],
      "Akuku-Toru": ["Abonnema", "Port Harcourt", "Buguma", "Degema"],
      "Andoni": ["Andoni", "Port Harcourt", "Bonny", "Opobo"],
      "Asari-Toru": ["Buguma", "Port Harcourt", "Abonnema", "Degema"],
      "Bonny": ["Bonny", "Port Harcourt", "Opobo", "Andoni"],
      "Degema": ["Degema", "Port Harcourt", "Abonnema", "Buguma"],
      "Eleme": ["Eleme", "Port Harcourt", "Obio-Akpor", "Okrika"],
      "Emohua": ["Emohua", "Port Harcourt", "Ikwerre", "Etche"],
      "Etche": ["Etche", "Port Harcourt", "Ikwerre", "Emohua"],
      "Gokana": ["Gokana", "Port Harcourt", "Khana", "Ogoni"],
      "Ikwerre": ["Ikwerre", "Port Harcourt", "Obio-Akpor", "Emohua"],
      "Khana": ["Bori", "Port Harcourt", "Gokana", "Ogoni"],
      "Obio/Akpor": ["Rumuola", "Port Harcourt", "Rumuokoro", "Rumuibekwe"],
      "Ogba/Egbema/Ndoni": ["Omoku", "Port Harcourt", "Ahoada", "Abua"],
      "Ogu/Bolo": ["Ogu", "Port Harcourt", "Okrika", "Eleme"],
      "Okrika": ["Okrika", "Port Harcourt", "Eleme", "Ogu"],
      "Omuma": ["Omuma", "Port Harcourt", "Ikwerre", "Etche"],
      "Opobo/Nkoro": ["Opobo", "Port Harcourt", "Bonny", "Andoni"],
      "Oyigbo": ["Oyigbo", "Port Harcourt", "Obio-Akpor", "Ikwerre"],
      "Port Harcourt": ["Port Harcourt", "GRA", "Old GRA", "Rumuola", "Mile 3", "Creek Road"],
      "Tai": ["Tai", "Port Harcourt", "Gokana", "Ogoni"]
    }
  },
  "Sokoto": {
    lgas: {
      "Binji": ["Binji", "Sokoto", "Wurno", "Illela"],
      "Bodinga": ["Bodinga", "Sokoto", "Wurno", "Illela"],
      "Dange Shuni": ["Dange Shuni", "Sokoto", "Wurno", "Illela"],
      "Gada": ["Gada", "Sokoto", "Wurno", "Illela"],
      "Goronyo": ["Goronyo", "Sokoto", "Wurno", "Illela"],
      "Gudu": ["Gudu", "Sokoto", "Wurno", "Illela"],
      "Gwadabawa": ["Gwadabawa", "Sokoto", "Wurno", "Illela"],
      "Illela": ["Illela", "Sokoto", "Wurno", "Gwadabawa"],
      "Isa": ["Isa", "Sokoto", "Wurno", "Illela"],
      "Kebbe": ["Kebbe", "Sokoto", "Wurno", "Illela"],
      "Kware": ["Kware", "Sokoto", "Wurno", "Illela"],
      "Rabah": ["Rabah", "Sokoto", "Wurno", "Illela"],
      "Sabon Birni": ["Sabon Birni", "Sokoto", "Wurno", "Illela"],
      "Shagari": ["Shagari", "Sokoto", "Wurno", "Illela"],
      "Silame": ["Silame", "Sokoto", "Wurno", "Illela"],
      "Sokoto North": ["Sokoto", "Gawon Nama", "Mabera", "Runjin Sambo"],
      "Sokoto South": ["Sokoto", "Gawon Nama", "Mabera", "Runjin Sambo"],
      "Tambuwal": ["Tambuwal", "Sokoto", "Wurno", "Illela"],
      "Tangaza": ["Tangaza", "Sokoto", "Wurno", "Illela"],
      "Tureta": ["Tureta", "Sokoto", "Wurno", "Illela"],
      "Wamako": ["Wamako", "Sokoto", "Wurno", "Illela"],
      "Wurno": ["Wurno", "Sokoto", "Gwadabawa", "Illela"],
      "Yabo": ["Yabo", "Sokoto", "Wurno", "Illela"]
    }
  },
  "Taraba": {
    lgas: {
      "Ardo Kola": ["Ardo Kola", "Jalingo", "Yorro", "Zing"],
      "Bali": ["Bali", "Jalingo", "Yorro", "Zing"],
      "Donga": ["Donga", "Jalingo", "Yorro", "Zing"],
      "Gashaka": ["Gashaka", "Jalingo", "Yorro", "Zing"],
      "Gasso": ["Gasso", "Jalingo", "Yorro", "Zing"],
      "Ibi": ["Ibi", "Jalingo", "Yorro", "Zing"],
      "Jalingo": ["Jalingo", "Yorro", "Zing", "Donga"],
      "Karim Lamido": ["Karim Lamido", "Jalingo", "Yorro", "Zing"],
      "Kumi": ["Kumi", "Jalingo", "Yorro", "Zing"],
      "Lau": ["Lau", "Jalingo", "Yorro", "Zing"],
      "Sardauna": ["Sardauna", "Jalingo", "Yorro", "Zing"],
      "Takum": ["Takum", "Jalingo", "Yorro", "Zing"],
      "Ussa": ["Ussa", "Jalingo", "Yorro", "Zing"],
      "Wukari": ["Wukari", "Jalingo", "Yorro", "Zing"],
      "Yorro": ["Yorro", "Jalingo", "Zing", "Donga"],
      "Zing": ["Zing", "Jalingo", "Yorro", "Donga"]
    }
  },
  "Yobe": {
    lgas: {
      "Bade": ["Gashua", "Nguru", "Potiskum", "Damaturu"],
      "Bursari": ["Bursari", "Damaturu", "Potiskum", "Nguru"],
      "Damaturu": ["Damaturu", "Potiskum", "Nguru", "Gashua"],
      "Fika": ["Fika", "Potiskum", "Damaturu", "Nguru"],
      "Fune": ["Fune", "Damaturu", "Potiskum", "Nguru"],
      "Geidam": ["Geidam", "Damaturu", "Potiskum", "Nguru"],
      "Gujba": ["Gujba", "Damaturu", "Potiskum", "Nguru"],
      "Gulani": ["Gulani", "Damaturu", "Potiskum", "Nguru"],
      "Jakusko": ["Jakusko", "Damaturu", "Potiskum", "Nguru"],
      "Karasuwa": ["Karasuwa", "Damaturu", "Potiskum", "Nguru"],
      "Machina": ["Machina", "Damaturu", "Potiskum", "Nguru"],
      "Nangere": ["Nangere", "Damaturu", "Potiskum", "Nguru"],
      "Nguru": ["Nguru", "Damaturu", "Potiskum", "Gashua"],
      "Potiskum": ["Potiskum", "Damaturu", "Nguru", "Gashua"],
      "Tarmua": ["Tarmua", "Damaturu", "Potiskum", "Nguru"],
      "Tarmuwa": ["Tarmuwa", "Damaturu", "Potiskum", "Nguru"],
      "Yunusari": ["Yunusari", "Damaturu", "Potiskum", "Nguru"],
      "Yusufari": ["Yusufari", "Damaturu", "Potiskum", "Nguru"]
    }
  },
  "Zamfara": {
    lgas: {
      "Anka": ["Anka", "Gusau", "Talata Mafara", "Kaura Namoda"],
      "Bakura": ["Bakura", "Gusau", "Talata Mafara", "Kaura Namoda"],
      "Birnin Magaji/Kiyaw": ["Birnin Magaji", "Gusau", "Talata Mafara", "Kaura Namoda"],
      "Bukkuyum": ["Bukkuyum", "Gusau", "Talata Mafara", "Kaura Namoda"],
      "Bungudu": ["Bungudu", "Gusau", "Talata Mafara", "Kaura Namoda"],
      "Gummi": ["Gummi", "Gusau", "Talata Mafara", "Kaura Namoda"],
      "Gusau": ["Gusau", "Talata Mafara", "Kaura Namoda", "Anka"],
      "Kaura Namoda": ["Kaura Namoda", "Gusau", "Talata Mafara", "Anka"],
      "Maradun": ["Maradun", "Gusau", "Talata Mafara", "Kaura Namoda"],
      "Maru": ["Maru", "Gusau", "Talata Mafara", "Kaura Namoda"],
      "Shinkafi": ["Shinkafi", "Gusau", "Talata Mafara", "Kaura Namoda"],
      "Talata Mafara": ["Talata Mafara", "Gusau", "Kaura Namoda", "Anka"],
      "Tsafe": ["Tsafe", "Gusau", "Talata Mafara", "Kaura Namoda"],
      "Zurmi": ["Zurmi", "Gusau", "Talata Mafara", "Kaura Namoda"]
    }
  }
};

export const STATES = Object.keys(NIGERIA_ADDRESS_DATA).sort();

export function getLGAs(state) {
  if (!state || !NIGERIA_ADDRESS_DATA[state]) return [];
  return Object.keys(NIGERIA_ADDRESS_DATA[state].lgas).sort();
}

export function getCities(state, lga) {
  if (!state || !lga) return [];
  return NIGERIA_ADDRESS_DATA[state]?.lgas[lga] || [];
}
// ============================================================
// useNigeriaAddress.js — Custom hook for cascading address state
// Usage: const { address, handlers, derived } = useNigeriaAddress(initialValues)
// ============================================================

import { useState, useCallback } from 'react';
import { STATES, getLGAs, getCities } from '../data/nigeriaAddressData';

/**
 * @param {Object} initial - Optional initial values { state, lga, city, street, landmark }
 */
export function useNigeriaAddress(initial = {}) {
  const [address, setAddress] = useState({
    state:    initial.state    || '',
    lga:      initial.lga      || '',
    city:     initial.city     || '',
    street:   initial.street   || '',
    landmark: initial.landmark || '',
  });

  // Cascading: changing state resets lga + city
  const handleStateChange = useCallback((e) => {
    const value = e.target.value;
    setAddress(prev => ({ ...prev, state: value, lga: '', city: '' }));
  }, []);

  // Cascading: changing lga resets city
  const handleLGAChange = useCallback((e) => {
    const value = e.target.value;
    setAddress(prev => ({ ...prev, lga: value, city: '' }));
  }, []);

  const handleCityChange = useCallback((e) => {
    setAddress(prev => ({ ...prev, city: e.target.value }));
  }, []);

  const handleStreetChange = useCallback((e) => {
    setAddress(prev => ({ ...prev, street: e.target.value }));
  }, []);

  const handleLandmarkChange = useCallback((e) => {
    setAddress(prev => ({ ...prev, landmark: e.target.value }));
  }, []);

  // Reset all fields
  const resetAddress = useCallback(() => {
    setAddress({ state: '', lga: '', city: '', street: '', landmark: '' });
  }, []);

  // Bulk set (e.g. when editing an existing record)
  const setAddressValues = useCallback((values) => {
    setAddress(prev => ({ ...prev, ...values }));
  }, []);

  // Derived lists (auto-update from current selections)
  const lgas   = getLGAs(address.state);
  const cities = getCities(address.state, address.lga);

  // Formatted full address string (for display / submission)
  const fullAddress = [
    address.street,
    address.city,
    address.lga,
    address.state,
    'Nigeria',
  ].filter(Boolean).join(', ');

  // Validation helpers
  const isStateValid = Boolean(address.state);
  const isLGAValid   = Boolean(address.lga);
  const isCityValid  = Boolean(address.city);
  const isStreetValid = address.street.trim().length >= 3;
  const isAddressComplete = isStateValid && isLGAValid && isCityValid && isStreetValid;

  return {
    address,
    handlers: {
      handleStateChange,
      handleLGAChange,
      handleCityChange,
      handleStreetChange,
      handleLandmarkChange,
      resetAddress,
      setAddressValues,
    },
    derived: {
      states:   STATES,
      lgas,
      cities,
      fullAddress,
      isStateValid,
      isLGAValid,
      isCityValid,
      isStreetValid,
      isAddressComplete,
    },
  };
}
const BASE_URL = import.meta.env.VITE_API_URL;

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};


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


export const submitRecord = async (token, payload) => {
  const res = await fetch(`${BASE_URL}/api/records`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};


export const getAdminRecords = async (token) => {
  const res = await fetch(`${BASE_URL}/api/admin/records`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
};

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


export const exportRecordsExcel = (token) => {
  const link = document.createElement("a");
  link.href = `${BASE_URL}/api/admin/records/export`;

  fetch(`${BASE_URL}/api/admin/records/export`, {
    headers: authHeaders(token),
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `BHF_Records_${Date.now()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    });
};

@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --primary:       #2563eb;
  --primary-h:     #1d4ed8;
  --primary-l:     #3b82f6;
  --bg:            #0a0a0a;
  --card:          #111111;
  --card-2:        #1a1a1a;
  --border:        #1f2937;
  --input:         #1a1a1a;
  --text:          #ffffff;
  --text-2:        #9ca3af;
  --text-3:        #6b7280;
  --success:       #10b981;
  --success-h:     #059669;
  --error:         #ef4444;
  --ease:          cubic-bezier(0.4, 0, 0.2, 1);
  --t:             all 0.3s var(--ease);
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
}

/* ── 2. SHARED UTILITIES ─────────────────────────────────── */

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-3); }

/* Inputs */
.input-group { display: flex; flex-direction: column; gap: 0.5rem; }
.input-group label { font-size: 0.875rem; font-weight: 500; color: var(--text-2); display: flex; align-items: center; gap: 0.25rem; }
.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 1rem; width: 20px; height: 20px; color: var(--text-3); pointer-events: none; z-index: 2; }
.select-arrow { position: absolute; right: 1rem; width: 16px; height: 16px; color: var(--text-3); pointer-events: none; }

.input-group input,
.input-group select,
.input-group textarea {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: var(--input);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  color: var(--text);
  font-size: 0.9375rem;
  font-family: inherit;
  transition: var(--t);
}
.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
}
.input-group input::placeholder,
.input-group textarea::placeholder { color: var(--text-3); }
.input-group select { appearance: none; cursor: pointer; padding-right: 2.5rem; }
.input-group select option { background: var(--card); color: var(--text); }
.textarea-wrapper textarea { padding-left: 1rem; padding-top: 0.75rem; min-height: 120px; resize: vertical; }
input[readonly] { opacity: 0.9; cursor: default; font-weight: 600; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.875rem 1.5rem; border-radius: 0.5rem; font-size: 0.9375rem;
  font-weight: 600; cursor: pointer; border: none; transition: var(--t); font-family: inherit;
}
.btn-icon { width: 18px; height: 18px; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 6px -1px rgba(37,99,235,0.2); }
.btn-primary:hover { background: var(--primary-h); transform: translateY(-1px); box-shadow: 0 6px 12px -2px rgba(37,99,235,0.3); }
.btn-secondary { background: transparent; color: var(--text-2); border: 1px solid var(--border); }
.btn-secondary:hover { background: var(--input); color: var(--text); border-color: var(--text-3); }
.btn-success { background: var(--success); color: white; box-shadow: 0 4px 6px -1px rgba(16,185,129,0.2); }
.btn-success:hover { background: var(--success-h); transform: translateY(-1px); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }

.btn-hero-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.875rem 1.75rem; background: linear-gradient(135deg, #10b981, #059669);
  color: white; border: none; border-radius: 0.625rem; font-size: 1rem;
  font-weight: 700; cursor: pointer; transition: var(--t); font-family: 'DM Sans', sans-serif;
  box-shadow: 0 4px 20px rgba(16,185,129,0.3); position: relative;
}
.btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(16,185,129,0.4); }
.btn-hero-primary::before {
  content: ''; position: absolute; inset: -2px; border-radius: 0.75rem;
  background: linear-gradient(135deg, #10b981, #059669);
  opacity: 0; z-index: -1; transition: opacity 0.3s ease; filter: blur(8px);
}
.btn-hero-primary:hover::before { opacity: 0.5; }

.btn-hero-secondary {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.875rem 1.5rem; background: transparent; color: var(--text-2);
  border: 1px solid var(--border); border-radius: 0.625rem; font-size: 1rem;
  font-weight: 600; cursor: pointer; text-decoration: none; transition: var(--t);
  font-family: 'DM Sans', sans-serif;
}
.btn-hero-secondary:hover { background: var(--card); color: var(--text); border-color: var(--text-3); }

/* Spinner */
.login-spinner {
  display: inline-block; width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 0.4rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Tags */
.tags-input-container {
  background: var(--input); border: 1px solid var(--border); border-radius: 0.5rem;
  padding: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem;
  min-height: 50px; align-items: center; cursor: text; transition: var(--t);
}
.tags-input-container:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
.tags-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tag {
  background: var(--primary); color: white; padding: 0.25rem 0.75rem;
  border-radius: 0.25rem; font-size: 0.875rem; display: flex; align-items: center;
  gap: 0.5rem; animation: tagPop 0.2s ease;
}
@keyframes tagPop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.tag-remove { cursor: pointer; opacity: 0.8; transition: var(--t); background: none; border: none; color: white; line-height: 0; }
.tag-remove:hover { opacity: 1; }
.tags-input { background: transparent; border: none; color: var(--text); flex: 1; min-width: 120px; padding: 0.25rem; font-size: 0.9375rem; }
.tags-input:focus { outline: none; }

/* Focus ring */
input:focus-visible, select:focus-visible, textarea:focus-visible, button:focus-visible {
  outline: 2px solid var(--primary); outline-offset: 2px;
}

/* ── 3. LANDING PAGE ─────────────────────────────────────── */
.landing {
  min-height: 100vh;
  background: var(--bg);
  overflow-x: hidden;
}

/* Nav */
.landing-nav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(10,10,10,0.85); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.landing-nav-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 2rem;
  height: 64px; display: flex; align-items: center; gap: 2rem;
}
.landing-logo { display: flex; align-items: center; gap: 0.625rem; text-decoration: none; flex-shrink: 0; }
.landing-logo-icon {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, #0d9488, #10b981);
  border-radius: 9px; display: flex; align-items: center; justify-content: center;
  color: white; box-shadow: 0 0 16px rgba(16,185,129,0.35);
}
.landing-logo-text { display: flex; flex-direction: column; line-height: 1; }
.landing-logo-main { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
.landing-logo-sub { font-size: 0.65rem; color: #10b981; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
.landing-nav-links { display: flex; gap: 0.25rem; flex: 1; }
.nav-link { padding: 0.4rem 0.875rem; color: var(--text-2); text-decoration: none; font-size: 0.875rem; font-weight: 500; border-radius: 0.375rem; transition: var(--t); }
.nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
.landing-nav-right { display: flex; align-items: center; gap: 1rem; margin-left: auto; }

.lang-pills { display: flex; gap: 0.25rem; background: var(--card); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.2rem; }
.lang-pill { padding: 0.25rem 0.5rem; border: none; background: transparent; color: var(--text-3); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; border-radius: 0.25rem; cursor: pointer; transition: var(--t); font-family: inherit; }
.lang-pill:hover { color: var(--text); }
.lang-pill.active { background: var(--primary); color: white; }

.btn-nav-cta {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 1.125rem; background: var(--success); color: white;
  border: none; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: var(--t); font-family: inherit; white-space: nowrap;
  position: relative; overflow: hidden;
}
.btn-nav-cta:hover { background: var(--success-h); transform: translateY(-1px); box-shadow: 0 6px 16px rgba(16,185,129,0.3); }
.btn-nav-cta::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.15); transform: translateX(-100%); transition: transform 0.4s ease; }
.btn-nav-cta:hover::after { transform: translateX(100%); }

/* Hero */
.landing-hero {
  position: relative; min-height: 92vh; display: flex; align-items: center;
  max-width: 1200px; margin: 0 auto; padding: 5rem 2rem 4rem; gap: 4rem; overflow: hidden;
}
.hero-bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px);
  background-size: 48px 48px; pointer-events: none;
  animation: gridDrift 20s linear infinite;
}
.hero-bg-glow {
  position: absolute; top: -100px; right: -100px; width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%);
  pointer-events: none;
}
.hero-bg-glow-2 {
  position: absolute; bottom: -80px; left: -80px; width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%);
  pointer-events: none;
}
.hero-content { flex: 1; position: relative; z-index: 2; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25);
  color: #10b981; border-radius: 999px; padding: 0.35rem 0.875rem;
  font-size: 0.75rem; font-weight: 600; letter-spacing: 0.04em; margin-bottom: 1.75rem;
}
.hero-title {
  font-family: 'Sora', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800; line-height: 1.08; letter-spacing: -0.03em; margin-bottom: 1.5rem;
}
.hero-title-line1 { display: block; color: var(--text); }
.hero-title-line2 {
  display: block;
  background: linear-gradient(135deg, #10b981 0%, #0d9488 50%, #2563eb 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-sub { font-size: 1.0625rem; color: var(--text-2); line-height: 1.7; max-width: 520px; margin-bottom: 2.5rem; }
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

/* Hero floating card */
.hero-visual {
  flex-shrink: 0; position: relative; z-index: 2;
  animation: heroFadeUp 0.7s 0.2s ease both, floatCard 4s ease-in-out infinite;
}
.hero-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 1rem;
  padding: 1.25rem; width: 300px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.08);
}
.hero-card-header { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 1.25rem; }
.hero-card-dot { width: 10px; height: 10px; border-radius: 50%; }
.hero-card-dot.green  { background: #10b981; }
.hero-card-dot.yellow { background: #f59e0b; }
.hero-card-dot.red    { background: #ef4444; }
.hero-card-title { font-size: 0.75rem; font-weight: 600; color: var(--text-3); margin-left: 0.25rem; letter-spacing: 0.05em; text-transform: uppercase; }
.hero-card-live { margin-left: auto; display: flex; align-items: center; gap: 0.3rem; font-size: 0.62rem; font-weight: 700; color: #10b981; letter-spacing: 0.08em; }
.live-dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: livePulse 1.4s ease-in-out infinite; }
.hero-card-rows { display: flex; flex-direction: column; gap: 0.875rem; }
.hero-card-row {
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 0.875rem; border-bottom: 1px solid rgba(255,255,255,0.04);
  border-radius: 0.375rem; transition: background 0.3s ease;
}
.hero-card-row:last-child { border-bottom: none; padding-bottom: 0; }
.hero-card-row.row-active { background: rgba(16,185,129,0.06); }
.hcr-label { font-size: 0.8rem; color: var(--text-3); }
.hcr-value { font-size: 0.825rem; font-weight: 600; }
.hcr-value.good { color: #10b981; }
.hcr-value.warn { color: #f59e0b; }
.hcr-value.muted { color: var(--text-2); }
.hero-card-footer {
  display: flex; align-items: center; gap: 0.4rem; margin-top: 1.25rem;
  padding-top: 1rem; border-top: 1px solid var(--border); font-size: 0.72rem; color: var(--text-3);
}
.hcf-timestamp { margin-left: auto; font-size: 0.68rem; color: var(--text-3); font-variant-numeric: tabular-nums; }
.card-progress-bar { height: 3px; background: rgba(255,255,255,0.05); border-radius: 999px; margin-top: 1rem; overflow: hidden; }
.card-progress-fill { height: 100%; background: linear-gradient(90deg, #10b981, #2563eb); border-radius: 999px; transition: width 0.25s ease; }
.footer-sync-badge {
  background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.35);
  color: #10b981; border-radius: 999px; font-size: 0.6rem; font-weight: 800;
  padding: 0.1rem 0.45rem; letter-spacing: 0.1em; animation: badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1);
}

/* Stats bar */
.landing-stats {
  display: flex; justify-content: center;
  background: var(--card); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
}
.stat-item { flex: 1; max-width: 220px; padding: 2.5rem 1.5rem; text-align: center; border-right: 1px solid var(--border); }
.stat-item:last-child { border-right: none; }
.stat-value { display: block; font-family: 'Sora', sans-serif; font-size: 2.25rem; font-weight: 800; color: #10b981; letter-spacing: -0.03em; margin-bottom: 0.35rem; font-variant-numeric: tabular-nums; }
.stat-label { font-size: 0.8rem; color: var(--text-3); font-weight: 500; letter-spacing: 0.03em; }

/* Features */
.landing-features { max-width: 1200px; margin: 0 auto; padding: 6rem 2rem; }
.section-header { text-align: center; margin-bottom: 3.5rem; }
.section-tag {
  display: inline-block; background: rgba(37,99,235,0.1); border: 1px solid rgba(37,99,235,0.2);
  color: var(--primary-l); border-radius: 999px; padding: 0.25rem 0.875rem;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1rem;
}
.section-title-lg { font-family: 'Sora', sans-serif; font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; color: var(--text); letter-spacing: -0.025em; margin-bottom: 0.75rem; }
.section-sub { color: var(--text-2); font-size: 1rem; max-width: 500px; margin: 0 auto; line-height: 1.6; }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
.feature-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 0.875rem;
  padding: 1.75rem; transition: var(--t); position: relative; overflow: hidden;
}
.feature-card::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(16,185,129,0.04), transparent);
  opacity: 0; transition: var(--t);
}
.feature-card::after {
  content: ''; position: absolute; top: -50%; left: -60%; width: 40%; height: 200%;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%);
  transform: skewX(-15deg); transition: left 0.6s ease; pointer-events: none;
}
.feature-card:hover { border-color: rgba(16,185,129,0.25); transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.3); }
.feature-card:hover::before { opacity: 1; }
.feature-card:hover::after { left: 130%; }
.feature-icon { width: 44px; height: 44px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 0.625rem; display: flex; align-items: center; justify-content: center; color: #10b981; margin-bottom: 1rem; }
.feature-title { font-family: 'Sora', sans-serif; font-size: 0.9375rem; font-weight: 700; color: var(--text); margin-bottom: 0.6rem; }
.feature-desc { font-size: 0.875rem; color: var(--text-2); line-height: 1.65; }

/* How it works */
.landing-how { background: var(--card); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 6rem 2rem; }
.how-steps { display: flex; max-width: 1000px; margin: 0 auto; position: relative; }
.how-step { flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 1.5rem; position: relative; }
.how-connector {
  position: absolute; top: 28px; right: -50%; width: 100%; height: 1px;
  background: linear-gradient(90deg, var(--border), rgba(16,185,129,0.3), var(--border)); z-index: 0;
}
.how-step-num {
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05));
  border: 1px solid rgba(16,185,129,0.3); color: #10b981;
  font-family: 'Sora', sans-serif; font-size: 0.875rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1.25rem; position: relative; z-index: 1; letter-spacing: 0.05em;
}
.how-step-content h3 { font-family: 'Sora', sans-serif; font-size: 0.9375rem; font-weight: 700; color: var(--text); margin-bottom: 0.5rem; }
.how-step-content p { font-size: 0.825rem; color: var(--text-2); line-height: 1.6; }

/* CTA Banner */
.landing-cta-banner { padding: 6rem 2rem; text-align: center; }
.cta-banner-inner { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; }
.cta-banner-icons {
  width: 72px; height: 72px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  margin-bottom: 0.5rem; position: relative;
}
.cta-banner-icons::before,
.cta-banner-icons::after { content: ''; position: absolute; inset: -8px; border-radius: 50%; border: 1px solid rgba(16,185,129,0.2); animation: ringPulse 2.5s ease-in-out infinite; }
.cta-banner-icons::after { inset: -16px; animation-delay: 0.5s; }
.landing-cta-banner h2 { font-family: 'Sora', sans-serif; font-size: 2rem; font-weight: 800; color: var(--text); letter-spacing: -0.025em; }
.landing-cta-banner p { color: var(--text-2); font-size: 1rem; line-height: 1.6; }

/* Footer */
.landing-footer { background: var(--card); border-top: 1px solid var(--border); padding: 3rem 2rem; }
.landing-footer-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 0.875rem; text-align: center; }
.footer-tagline { color: var(--text-2); font-size: 0.875rem; }
.footer-rights { color: var(--text-3); font-size: 0.75rem; }

/* ── 4. LOGIN PAGE ────────────────────────────────────────── */
.login-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: var(--bg); padding: 2rem; position: relative; overflow: hidden;
}
.login-bg-glow {
  position: absolute; top: -150px; left: 50%; transform: translateX(-50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%);
  pointer-events: none;
}
.login-bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px);
  background-size: 48px 48px; pointer-events: none;
}
.login-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 1.25rem;
  padding: 2.5rem 2rem; width: 100%; max-width: 420px; position: relative; z-index: 2;
  box-shadow: 0 24px 64px rgba(0,0,0,0.4); animation: heroFadeUp 0.5s ease both;
}
.login-logo { display: flex; align-items: center; gap: 0.625rem; margin-bottom: 1.75rem; }
.login-title { font-family: 'Sora', sans-serif; font-size: 1.5rem; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 0.35rem; }
.login-sub { font-size: 0.875rem; color: var(--text-2); margin-bottom: 1.75rem; line-height: 1.5; }
.login-form { display: flex; flex-direction: column; gap: 1.1rem; }
.login-btn { width: 100%; margin-top: 0.5rem; justify-content: center; }
.login-error {
  display: flex; align-items: center; gap: 0.5rem;
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
  color: var(--error); border-radius: 0.5rem; padding: 0.625rem 0.875rem;
  font-size: 0.825rem; margin-bottom: 0.5rem;
}
.login-role-hint {
  display: flex; align-items: center; gap: 0.4rem; font-size: 0.775rem; color: var(--text-3);
  background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.12);
  border-radius: 0.375rem; padding: 0.5rem 0.75rem;
}
.login-toggle { text-align: center; font-size: 0.825rem; color: var(--text-3); margin-top: 1.25rem; }
.login-toggle-btn { background: none; border: none; color: var(--primary-l); font-size: 0.825rem; font-weight: 600; cursor: pointer; padding: 0; font-family: inherit; transition: var(--t); }
.login-toggle-btn:hover { color: var(--primary); text-decoration: underline; }
.auth-mode-tabs { display: flex; background: var(--input); border: 1px solid var(--border); border-radius: 0.5rem; padding: 3px; gap: 3px; margin-bottom: 1.25rem; }
.auth-mode-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.35rem; padding: 0.45rem; border: none; background: transparent; color: var(--text-3); border-radius: 0.375rem; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: var(--t); font-family: inherit; }
.auth-mode-tab:hover { color: var(--text); }
.auth-mode-tab.active { background: var(--card-2); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
.pw-toggle { position: absolute; right: 0.875rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-3); cursor: pointer; padding: 0; line-height: 0; z-index: 3; transition: var(--t); }
.pw-toggle:hover { color: var(--text); }

/* ── 5. FORM PAGE ────────────────────────────────────────── */
.container { display: flex; min-height: 100vh; background: var(--bg); }

/* Sidebar */
.dashboard {
  width: 300px; background: var(--card); border-right: 1px solid var(--border);
  padding: 2rem; display: flex; flex-direction: column;
  position: fixed; height: 100vh; left: 0; top: 0; z-index: 100;
}
.logo { display: flex; align-items: center; gap: 0.75rem; font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 800; margin-bottom: 0.25rem; }
.logo-icon { color: var(--success); width: 28px; height: 28px; }
.logo-sub { margin-bottom: 2rem; }
.logo-sub p { font-size: 0.65rem; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.15rem; }
.logo-sub .app-name { font-size: 0.75rem; color: var(--primary-l); font-weight: 600; letter-spacing: 0.05em; }
.progress-steps { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }
.step { display: flex; align-items: flex-start; gap: 0.875rem; opacity: 0.5; transition: var(--t); cursor: pointer; }
.step.active, .step.completed { opacity: 1; }
.step-number { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem; transition: var(--t); flex-shrink: 0; }
.step.active .step-number { border-color: var(--primary); background: var(--primary); color: white; }
.step.completed .step-number { background: var(--success); border-color: var(--success); color: white; }
.step-info h4 { font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem; color: var(--text); }
.step-info p { font-size: 0.75rem; color: var(--text-2); }
.lang-toggle { margin-bottom: 1.25rem; padding: 0.875rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; }
.lang-label { font-size: 0.7rem; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; }
.lang-select { width: 100%; padding: 0.5rem 2rem 0.5rem 0.75rem; background: var(--input); border: 1px solid var(--border); border-radius: 0.375rem; color: var(--text); font-size: 0.85rem; font-family: inherit; cursor: pointer; appearance: none; transition: var(--t); }
.lang-select:focus { outline: none; border-color: var(--primary); }
.lang-select option { background: var(--card); color: var(--text); }
.dashboard-home-btn { display: flex; align-items: center; gap: 0.5rem; background: transparent; border: 1px solid var(--border); color: var(--text-3); border-radius: 0.375rem; padding: 0.5rem 0.875rem; font-size: 0.8rem; font-weight: 500; cursor: pointer; margin-bottom: 1rem; transition: var(--t); font-family: inherit; width: 100%; }
.dashboard-home-btn:hover { background: var(--input); color: var(--text); }
.dashboard-footer { margin-top: auto; padding-top: 1.5rem; border-top: 1px solid var(--border); text-align: center; }
.dashboard-footer p { font-size: 0.7rem; color: var(--text-3); margin-bottom: 0.5rem; }
.security-badges { display: flex; justify-content: center; gap: 0.5rem; }
.badge-icon { color: var(--text-3); }
.dashboard-close { display: none; position: absolute; top: 1rem; right: 1rem; background: transparent; border: 1px solid var(--border); border-radius: 0.375rem; color: var(--text-2); cursor: pointer; padding: 0.25rem; line-height: 0; transition: var(--t); }
.dashboard-close:hover { background: var(--input); color: var(--text); }
.dashboard-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 99; backdrop-filter: blur(2px); }

/* Main content */
.main-content { flex: 1; margin-left: 300px; padding: 2.5rem 3.5rem; max-width: 860px; }
.mobile-topbar { display: none; align-items: center; justify-content: space-between; padding: 0.875rem 1.25rem; background: var(--card); border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; border-radius: 0.75rem; gap: 0.75rem; }
.hamburger { background: transparent; border: 1px solid var(--border); border-radius: 0.375rem; color: var(--text-2); cursor: pointer; padding: 0.35rem; line-height: 0; transition: var(--t); flex-shrink: 0; }
.hamburger:hover { background: var(--input); color: var(--text); }
.mobile-brand { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 700; color: var(--text); flex: 1; }
.mobile-step { font-size: 0.75rem; font-weight: 600; color: var(--primary-l); background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); border-radius: 999px; padding: 0.2rem 0.6rem; flex-shrink: 0; }

/* Form top bar */
.form-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem; }
.back-to-home { display: inline-flex; align-items: center; gap: 0.4rem; background: transparent; border: 1px solid var(--border); color: var(--text-3); border-radius: 0.375rem; padding: 0.4rem 0.875rem; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: var(--t); font-family: inherit; }
.back-to-home:hover { background: var(--input); color: var(--text); border-color: var(--text-3); }
.user-chip { display: flex; align-items: center; gap: 0.6rem; background: var(--card); border: 1px solid var(--border); border-radius: 999px; padding: 0.35rem 0.75rem 0.35rem 0.35rem; }
.user-chip-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #2563eb); color: white; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.user-chip-info { display: flex; flex-direction: column; line-height: 1.2; }
.user-chip-name { font-size: 0.8rem; font-weight: 600; color: var(--text); }
.user-chip-role { font-size: 0.68rem; color: #10b981; font-weight: 500; }
.user-chip-logout { background: none; border: none; color: var(--text-3); cursor: pointer; padding: 0.2rem; line-height: 0; transition: var(--t); margin-left: 0.25rem; }
.user-chip-logout:hover { color: var(--error); }

/* Form header */
.form-header { margin-bottom: 2rem; }
.header-badge { display: inline-block; background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.3); border-radius: 999px; padding: 0.2rem 0.8rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.75rem; }
.form-header h1 { font-family: 'Sora', sans-serif; font-size: 1.85rem; font-weight: 800; margin-bottom: 0.35rem; background: linear-gradient(135deg, var(--text) 0%, var(--primary-l) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.subtitle { color: var(--text-2); font-size: 0.9rem; }

/* Form container */
.form-container { background: var(--card); border: 1px solid var(--border); border-radius: 1rem; padding: 2rem; }
.form-section { display: none; animation: fadeUp 0.35s ease; }
.form-section.active { display: block; }
.section-title { font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
.input-group.full-width { grid-column: 1 / -1; }

/* BP / BMI */
.bp-row { display: flex; align-items: center; gap: 0.5rem; }
.bp-row .input-wrapper { flex: 1; }
.bp-slash { font-size: 1.25rem; color: var(--text-3); font-weight: 300; flex-shrink: 0; }
.bmi-display { display: flex; align-items: center; gap: 0.75rem; }
.bmi-display .input-wrapper { flex: 1; }
.bmi-badge { padding: 0.3rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; color: white; white-space: nowrap; flex-shrink: 0; transition: var(--t); }
.field-hint { font-size: 0.72rem; color: var(--text-3); margin-top: 0.3rem; font-style: italic; }

/* Navigation / errors */
.form-navigation { display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1.75rem; border-top: 1px solid var(--border); }
.submit-error { display: flex; align-items: center; gap: 0.5rem; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: var(--error); border-radius: 0.5rem; padding: 0.75rem 1rem; font-size: 0.85rem; margin-top: 1rem; }

/* Success */
.success-message { text-align: center; padding: 4rem 2rem; background: var(--card); border: 1px solid var(--border); border-radius: 1rem; animation: fadeUp 0.5s ease; }
.success-icon { width: 76px; height: 76px; background: rgba(16,185,129,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; border: 2px solid var(--success); }
.check-icon { color: var(--success); }
.success-brand { display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-size: 0.72rem; font-weight: 700; color: var(--text-3); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; }
.success-message h2 { font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem; }
.success-message p { color: var(--text-2); margin-bottom: 2rem; }

/* ── 6. ADMIN DASHBOARD ──────────────────────────────────── */
.admin-page { min-height: 100vh; background: var(--bg); padding: 1.5rem 2rem; position: relative; overflow-x: hidden; }
.admin-bg-grid { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(37,99,235,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.025) 1px, transparent 1px); background-size: 44px 44px; }
.admin-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 1.5rem; background: var(--card); border: 1px solid var(--border); border-radius: 0.875rem; margin-bottom: 1.25rem; position: relative; z-index: 1; flex-wrap: wrap; }
.admin-header-left { display: flex; align-items: center; gap: 1.5rem; }
.admin-header-right { display: flex; align-items: center; gap: 0.875rem; flex-wrap: wrap; }
.admin-title-block { border-left: 1px solid var(--border); padding-left: 1.5rem; }
.admin-title { font-family: 'Sora', sans-serif; font-size: 1.2rem; font-weight: 800; margin-bottom: 0.15rem; }
.admin-sub { font-size: 0.78rem; color: var(--text-2); }
.admin-stats-bar { display: flex; gap: 1rem; margin-bottom: 1.25rem; position: relative; z-index: 1; flex-wrap: wrap; }
.admin-stat { flex: 1; min-width: 120px; background: var(--card); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem 1.25rem; text-align: center; }
.admin-stat-val { display: block; font-family: 'Sora', sans-serif; font-size: 1.75rem; font-weight: 800; color: var(--success); }
.admin-stat-label { font-size: 0.75rem; color: var(--text-2); font-weight: 500; }
.admin-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; position: relative; z-index: 1; flex-wrap: wrap; }
.admin-tabs { display: flex; gap: 0.35rem; background: var(--card); border: 1px solid var(--border); border-radius: 0.5rem; padding: 3px; }
.admin-tab { display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.875rem; border: none; background: transparent; color: var(--text-3); border-radius: 0.375rem; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: var(--t); font-family: inherit; }
.admin-tab:hover { color: var(--text); }
.admin-tab.active { background: var(--card-2); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
.admin-table-wrap { background: var(--card); border: 1px solid var(--border); border-radius: 0.875rem; overflow: hidden; position: relative; z-index: 1; }
.admin-loading { display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 4rem; color: var(--text-2); font-size: 0.9rem; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table thead tr { background: var(--card-2); border-bottom: 1px solid var(--border); }
.admin-table th { padding: 0.875rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 700; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; }
.admin-table tbody tr { border-bottom: 1px solid rgba(31,41,55,0.7); transition: background 0.15s; }
.admin-table tbody tr:last-child { border-bottom: none; }
.admin-table tbody tr:hover { background: rgba(255,255,255,0.02); }
.admin-table td { padding: 0.75rem 1rem; font-size: 0.85rem; }
.td-name { font-weight: 600; color: var(--text); }
.td-muted { color: var(--text-2); }
.role-select { padding: 0.3rem 0.6rem; background: var(--input); border: 1px solid var(--border); border-radius: 0.375rem; color: var(--text); font-size: 0.78rem; font-family: inherit; cursor: pointer; }
.role-select:focus { outline: none; border-color: var(--primary); }
.icon-btn { width: 28px; height: 28px; border-radius: 0.375rem; border: 1px solid var(--border); background: transparent; color: var(--text-2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--t); padding: 0; }
.icon-btn:hover { background: var(--input); color: var(--text); border-color: var(--text-3); }
.icon-btn.red:hover { background: rgba(239,68,68,0.1); color: var(--error); border-color: rgba(239,68,68,0.3); }
.icon-btn.green:hover { background: rgba(16,185,129,0.1); color: var(--success); border-color: rgba(16,185,129,0.3); }
.icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* ── 7. 404 NOT FOUND ────────────────────────────────────── */
.notfound-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); position: relative; overflow: hidden; padding: 2rem; }
.notfound-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; }
.notfound-glow { position: absolute; top: -150px; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 65%); pointer-events: none; }
.notfound-glow-2 { top: auto; bottom: -150px; background: radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 65%); }
.notfound-content { display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; z-index: 2; max-width: 480px; width: 100%; }
.notfound-logo { display: flex; align-items: center; gap: 0.625rem; margin-bottom: 3rem; }
.notfound-number { font-family: 'Sora', sans-serif; font-size: clamp(7rem, 20vw, 12rem); font-weight: 800; letter-spacing: -0.05em; line-height: 1; margin-bottom: 1.5rem; background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; position: relative; user-select: none; }
.notfound-glitch { animation: glitchShake 0.15s ease both; }
.notfound-glitch-copy { position: absolute; top: 0; left: 0; width: 100%; background: linear-gradient(135deg, #ef4444, #dc2626); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%); animation: glitchSlice 0.15s ease both; pointer-events: none; }
.notfound-icon-wrap { position: relative; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.75rem; }
.notfound-icon-x { position: absolute; bottom: -4px; right: -4px; background: var(--bg); border-radius: 50%; padding: 2px; line-height: 0; }
.notfound-title { font-family: 'Sora', sans-serif; font-size: 1.75rem; font-weight: 800; color: var(--text); letter-spacing: -0.025em; margin-bottom: 0.75rem; }
.notfound-sub { font-size: 0.9375rem; color: var(--text-2); line-height: 1.65; margin-bottom: 2.5rem; max-width: 360px; }
.notfound-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-bottom: 3rem; }
.notfound-footer { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: var(--text-3); }

/* ── 8. ANIMATIONS ───────────────────────────────────────── */
@keyframes fadeUp    { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes heroFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes gridDrift { 0% { background-position: 0 0; } 100% { background-position: 48px 48px; } }
@keyframes floatCard { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes livePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
@keyframes ringPulse { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.12); opacity: 0.2; } }
@keyframes badgePop  { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes glitchShake { 0% { transform: translateX(0); } 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-2px); } 100% { transform: translateX(0); } }
@keyframes glitchSlice { 0% { transform: translateX(0); opacity: 1; } 50% { transform: translateX(6px); opacity: 0.8; } 100% { transform: translateX(0); opacity: 0; } }
@keyframes stepNumPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }

/* Scroll-driven entrance classes */
.hero-anim { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1); }
.hero-anim--in { opacity: 1; transform: translateY(0); }
.hero-visual.hero-anim { transform: translateX(32px); }
.hero-visual.hero-anim--in { transform: translateX(0); }
.hcr--anim { opacity: 0; transform: translateX(12px); transition: opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1); }
.hcr--show { opacity: 1; transform: translateX(0); }
.how-step--anim { opacity: 0; transform: translateY(20px); transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1); }
.how-step--visible { opacity: 1; transform: translateY(0); }
.how-step-num { transform: scale(0.6); opacity: 0; transition: transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease, background 0.3s ease, border-color 0.3s ease; }
.how-step-num--visible, .how-step-num.how-step-pop { transform: scale(1); opacity: 1; animation: stepNumPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
.how-connector--anim { transform: scaleX(0); transform-origin: left center; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
.how-connector--visible { transform: scaleX(1); }

/* ── 9. RESPONSIVE ───────────────────────────────────────── */
@media (max-width: 1024px) {
  .dashboard { transform: translateX(-100%); transition: transform 0.3s var(--ease); box-shadow: 4px 0 24px rgba(0,0,0,0.5); }
  .dashboard.open { transform: translateX(0); }
  .dashboard-close { display: flex; }
  .dashboard-overlay { display: block; }
  .main-content { margin-left: 0; padding: 1.5rem; max-width: 100%; }
  .mobile-topbar { display: flex; }
  .form-grid { grid-template-columns: 1fr; }
  .input-group.full-width { grid-column: 1; }
  .landing-hero { flex-direction: column; min-height: auto; padding: 4rem 1.5rem 3rem; gap: 3rem; text-align: center; }
  .hero-sub { margin: 0 auto 2.5rem; }
  .hero-actions { justify-content: center; }
  .hero-visual { display: none; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .landing-nav-links { display: none; }
}

@media (max-width: 768px) {
  .admin-page { padding: 1rem; }
  .admin-header { flex-direction: column; align-items: flex-start; }
  .admin-title-block { border-left: none; padding-left: 0; border-top: 1px solid var(--border); padding-top: 0.75rem; width: 100%; }
  .admin-table-wrap { overflow-x: auto; }
  .admin-table { min-width: 700px; }
  .landing-stats { flex-wrap: wrap; }
  .stat-item { flex: 1 1 50%; max-width: 50%; border-right: none; border-bottom: 1px solid var(--border); }
  .stat-item:nth-child(odd) { border-right: 1px solid var(--border); }
  .stat-item:nth-last-child(-n+2) { border-bottom: none; }
  .features-grid { grid-template-columns: 1fr; }
  .how-steps { flex-direction: column; gap: 2rem; }
  .how-connector { display: none; }
  .lang-pills { display: none; }
  .landing-nav-inner { padding: 0 1rem; }
}

@media (max-width: 640px) {
  .main-content { padding: 1rem; }
  .form-container { padding: 1.25rem; }
  .form-header h1 { font-size: 1.4rem; }
  .subtitle { font-size: 0.85rem; }
  .btn { width: 100%; justify-content: center; }
  .form-navigation { flex-direction: column-reverse; gap: 0.75rem; }
  .bmi-display { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .mobile-topbar { border-radius: 0.5rem; margin-bottom: 1rem; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 2rem; }
  .btn-hero-primary, .btn-hero-secondary { width: 100%; justify-content: center; }
  .hero-actions { flex-direction: column; }
  .btn-nav-cta span { display: none; }
}
/* ============================================================
   AddressFields — append these to App.css
   (under Section 2. Shared Utilities or Section 5. Form Page)
   ============================================================ */

/* Locked / disabled select visual feedback */
.input-group select:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Field-level error state */
.input-group.has-error input,
.input-group.has-error select,
.input-group.has-error textarea {
  border-color: var(--error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-error {
  font-size: 0.72rem;
  color: var(--error);
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Address preview chip */
.address-preview {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--text-2);
  line-height: 1.5;
  animation: fadeUp 0.3s ease;
  word-break: break-word;
}

.address-preview span {
  color: var(--text);
  font-weight: 500;
}
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LandingPage    from "./components/Home";
import LoginPage      from "./components/LoginPage";
import Dashboard      from "./components/Dashboard";
import Step1          from "./components/Step1";
import Step2          from "./components/Step2";
import Success        from "./components/Success";
import AdminDashboard from "./components/AdminDashboard";
import NotFound       from "./pages/NotFound";
import Icon           from "./components/Icon";
import { useAuth }    from "./context/AuthContext";
import { submitRecord } from "./services/api";
import "./App.css";

// ── Protected route wrappers ──────────────────────────────────
function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user || user.role !== "Administrator") return <NotFound />;
  return children;
}

// ── i18n ──────────────────────────────────────────────────────
const headerText = {
  en: { badge: "DataGuardian", title: "Beneficiary Intake Form", sub: "Beyond Health Foundation — Secure, encrypted data collection for community health programs." },
  ha: { badge: "DataGuardian", title: "Fom na Amfanin Masu Amfani", sub: "Gidauniyar Lafiya ta BHF — Tattara bayanai lafiya da sirri." },
  yo: { badge: "DataGuardian", title: "Fọọmu Gbigba Oluranlọwọ", sub: "BHF — Gbigba data ti o ni aabo fun awọn eto ilera agbegbe." },
  ig: { badge: "DataGuardian", title: "Ụdị Natarị Onye Ọrụ", sub: "BHF — Nchịkọta data nchekwa maka mmemme ahụike obodo." },
  fr: { badge: "DataGuardian", title: "Formulaire d'Admission", sub: "BHF — Collecte de données sécurisée pour les programmes de santé communautaire." },
  ar: { badge: "DataGuardian", title: "استمارة قبول المستفيد", sub: "مؤسسة BHF — جمع بيانات آمن ومشفر لبرامج الصحة المجتمعية." },
};

const navText = {
  en: { next: "Next Step",        prev: "Previous",    submit: "Submit Record",    home: "Home",      logout: "Logout" },
  ha: { next: "Mataki na Gaba",   prev: "Baya",         submit: "Aika Bayani",      home: "Gida",      logout: "Fita" },
  yo: { next: "Igbesẹ Ti o Tẹle", prev: "Iṣaaju",      submit: "Firanṣẹ Igbasilẹ", home: "Ile",       logout: "Jade" },
  ig: { next: "Nzọụkwụ Ọzọ",      prev: "Nazaghachi",   submit: "Zipu Ndekọ",       home: "Ulo",       logout: "Pụọ" },
  fr: { next: "Étape Suivante",    prev: "Précédent",    submit: "Soumettre",        home: "Accueil",   logout: "Déconnexion" },
  ar: { next: "الخطوة التالية",    prev: "السابق",       submit: "إرسال السجل",      home: "الرئيسية",  logout: "خروج" },
};

const emptyForm = {
  firstName: "", lastName: "", gender: "", age: "",
  phone: "", address: "", volunteerName: "",
  bloodPressureSystolic: "", bloodPressureDiastolic: "",
  bloodSugar: "", weight: "", height: "", bmi: "",
};

// ── Form page (Step 1 + 2) ────────────────────────────────────
function FormPage({ lang, setLang }) {
  const { user, logout } = useAuth();
  const [currentStep,   setCurrentStep]   = useState(1);
  const [conditions,    setConditions]    = useState([]);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [formData,      setFormData]      = useState(emptyForm);
  const [submitting,    setSubmitting]    = useState(false);
  const [submitError,   setSubmitError]   = useState("");
  const [done,          setDone]          = useState(false);

  const h     = headerText[lang] || headerText.en;
  const n     = navText[lang]    || navText.en;
  const isRTL = lang === "ar";

  const handleLogout = () => { logout(); window.location.href = "/"; };
  const nextStep     = () => { setCurrentStep(2); setDashboardOpen(false); };
  const prevStep     = () => { setCurrentStep(1); setDashboardOpen(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      await submitRecord(user?.token, {
        ...formData, conditions, lang,
        submittedAt: new Date().toISOString(),
      });
      setDone(true);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Success
        setSubmitted={() => {
          setDone(false);
          setFormData(emptyForm);
          setConditions([]);
          setCurrentStep(1);
        }}
        lang={lang}
      />
    );
  }

  return (
    <div className="container" dir={isRTL ? "rtl" : "ltr"}>
      {dashboardOpen && (
        <div className="dashboard-overlay" onClick={() => setDashboardOpen(false)} />
      )}

      <Dashboard
        currentStep={currentStep}
        setCurrentStep={(s) => { setCurrentStep(s); setDashboardOpen(false); }}
        lang={lang}
        setLang={setLang}
        dashboardOpen={dashboardOpen}
        setDashboardOpen={setDashboardOpen}
        onBackToHome={() => { window.location.href = "/"; }}
      />

      <main className="main-content">
        <div className="mobile-topbar">
          <button className="hamburger" onClick={() => setDashboardOpen(true)}>
            <Icon name="menu" size={20} />
          </button>
          <span className="mobile-brand">
            <Icon name="shield-plus" size={16} />
            BHF DataGuardian
          </span>
          <span className="mobile-step">{currentStep}/2</span>
        </div>

        <div className="form-top-row">
          <button className="back-to-home" onClick={() => { window.location.href = "/"; }}>
            <Icon name="arrow-left" size={15} />
            {n.home}
          </button>

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

        <header className="form-header">
          <div className="header-badge">{h.badge}</div>
          <h1>{h.title}</h1>
          <p className="subtitle">{h.sub}</p>
        </header>

        <form className="form-container" onSubmit={handleSubmit}>
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

          {submitError && (
            <div className="submit-error">
              <Icon name="x" size={14} />
              {submitError}
            </div>
          )}

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
                  ? <><span className="login-spinner" />Saving...</>
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

// ── Root App with Routes ──────────────────────────────────────
export default function App() {
  const { user, ready } = useAuth();
  const [lang, setLang] = useState("en");

  if (!ready) return null;

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={
        <LandingPage
          onStart={() => {
            if (!user) window.location.href = "/login";
            else if (user.role === "Administrator") window.location.href = "/admin";
            else window.location.href = "/dashboard";
          }}
          lang={lang}
          setLang={setLang}
        />
      } />

      <Route path="/login" element={
        user
          ? <Navigate to={user.role === "Administrator" ? "/admin" : "/dashboard"} replace />
          : <LoginPage
              onSuccess={(data) => {
                window.location.href = data.role === "Administrator" ? "/admin" : "/dashboard";
              }}
              onBack={() => { window.location.href = "/"; }}
              lang={lang}
            />
      } />

      {/* Protected: logged-in users */}
      <Route path="/dashboard" element={
        <RequireAuth>
          <FormPage lang={lang} setLang={setLang} />
        </RequireAuth>
      } />

      {/* Protected: admins only */}
      <Route path="/admin" element={
        <RequireAdmin>
          <AdminDashboard onBack={() => { window.location.href = "/"; }} />
        </RequireAdmin>
      } />

      <Route path="*" element={
        <NotFound onBack={() => { window.location.href = "/"; }} />
      } />
    </Routes>
  );
}
// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ServerWake from "./components/ServerWake";
import App from "./App";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ServerWake>
          <App />
        </ServerWake>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);