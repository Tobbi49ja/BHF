// ── Sidebar ──────────────────────────────────────────────────
import Icon from "./Icon";

const LANGUAGES = [
  { code: "en", label: "English" }, { code: "ha", label: "Hausa" },
  { code: "yo", label: "Yoruba" },  { code: "ig", label: "Igbo" },
  { code: "fr", label: "Français" },{ code: "ar", label: "العربية" },
];

const STEPS = {
  en: [{ title: "Beneficiary Profile", desc: "Personal & contact details" }, { title: "Health Screening", desc: "BP, blood sugar & BMI" }],
  ha: [{ title: "Bayanan Amfani", desc: "Sunan mutum da lambar wayar" }, { title: "Gwajin Lafiya", desc: "BP, sukari da BMI" }],
  fr: [{ title: "Profil Bénéficiaire", desc: "Informations personnelles" }, { title: "Bilan de Santé", desc: "TA, glycémie & IMC" }],
};
const getSteps = (lang) => STEPS[lang] || STEPS.en;

export function Sidebar({ currentStep, setCurrentStep, lang, setLang, sidebarOpen, setSidebarOpen, onBackToHome }) {
  const steps = getSteps(lang);
  const isRTL = lang === "ar";
  return (
    <aside className={`sidebar${sidebarOpen ? " open" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
      <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
        <Icon name="x" size={18} />
      </button>
      <div className="logo"><Icon name="shield-plus" size={22} className="logo-icon" /><span>BHF</span></div>
      <div className="logo-sub"><p>Beyond Health Foundation</p><span className="app-name">DataGuardian</span></div>
      <div className="progress-steps">
        {steps.map((step, i) => (
          <div key={i} className={`step${currentStep === i + 1 ? " active" : ""}${currentStep > i + 1 ? " completed" : ""}`}
            onClick={() => setCurrentStep(i + 1)}>
            <div className="step-number">{currentStep > i + 1 ? <Icon name="check" size={14} /> : i + 1}</div>
            <div className="step-info"><h4>{step.title}</h4><p>{step.desc}</p></div>
          </div>
        ))}
      </div>
      <div className="lang-toggle">
        <p className="lang-label"><Icon name="globe" size={12} style={{ display: "inline", marginRight: 4 }} />Language</p>
        <div className="input-wrapper" style={{ marginTop: "0.4rem" }}>
          <Icon name="chevron-down" size={14} className="select-arrow" />
          <select className="lang-select" value={lang} onChange={(e) => setLang(e.target.value)}>
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </div>
      <button className="sidebar-home-btn" onClick={onBackToHome}>
        <Icon name="house" size={15} /> Back to Home
      </button>
      <div className="sidebar-footer">
        <p>Secure &amp; encrypted</p>
        <div className="security-badges">
          <Icon name="shield-check" size={16} className="badge-icon" />
          <Icon name="lock" size={16} className="badge-icon" />
        </div>
      </div>
    </aside>
  );
}

// ── Step 1 ────────────────────────────────────────────────────
export function Step1({ formData, setFormData, lang }) {
  const handle = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  return (
    <section className="form-section active">
      <h2 className="section-title"><Icon name="user-round" size={20} />Beneficiary Profile</h2>
      <div className="form-grid">
        <div className="input-group">
          <label>First Name</label>
          <div className="input-wrapper"><Icon name="user" size={16} className="input-icon" />
            <input type="text" name="firstName" placeholder="e.g. Amina" value={formData.firstName} onChange={handle} required /></div>
        </div>
        <div className="input-group">
          <label>Last Name</label>
          <div className="input-wrapper"><Icon name="user" size={16} className="input-icon" />
            <input type="text" name="lastName" placeholder="e.g. Musa" value={formData.lastName} onChange={handle} required /></div>
        </div>
        <div className="input-group">
          <label>Gender</label>
          <div className="input-wrapper"><Icon name="users" size={16} className="input-icon" />
            <select name="gender" value={formData.gender} onChange={handle} required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer not to say">Prefer not to say</option>
            </select>
            <Icon name="chevron-down" size={14} className="select-arrow" /></div>
        </div>
        <div className="input-group">
          <label>Age</label>
          <div className="input-wrapper"><Icon name="calendar" size={16} className="input-icon" />
            <input type="number" name="age" placeholder="e.g. 34" min="1" max="120" value={formData.age} onChange={handle} /></div>
        </div>
        <div className="input-group">
          <label>Phone Number</label>
          <div className="input-wrapper"><Icon name="phone" size={16} className="input-icon" />
            <input type="tel" name="phone" placeholder="+234 800 000 0000" value={formData.phone} onChange={handle} /></div>
        </div>
        <div className="input-group">
          <label>Community / Address</label>
          <div className="input-wrapper"><Icon name="map-pin" size={16} className="input-icon" />
            <input type="text" name="address" placeholder="Ward, LGA, State" value={formData.address} onChange={handle} /></div>
        </div>
        <div className="input-group full-width">
          <label>Volunteer / Recorder Name</label>
          <div className="input-wrapper"><Icon name="badge-check" size={16} className="input-icon" />
            <input type="text" name="volunteerName" placeholder="Full name of recorder" value={formData.volunteerName} onChange={handle} required /></div>
        </div>
      </div>
    </section>
  );
}

// ── Step 2 ────────────────────────────────────────────────────
import { useState } from "react";

export function Step2({ formData, setFormData, conditions, setConditions }) {
  const [condInput, setCondInput] = useState("");

  const handle = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    const w = parseFloat(e.target.name === "weight" ? e.target.value : updated.weight);
    const h = parseFloat(e.target.name === "height" ? e.target.value : updated.height) / 100;
    updated.bmi = (w && h) ? (w / (h * h)).toFixed(1) : "";
    setFormData(updated);
  };

  const addCond = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = condInput.trim();
      if (v && !conditions.includes(v)) setConditions([...conditions, v]);
      setCondInput("");
    }
  };

  const bmiColor = !formData.bmi ? "" :
    parseFloat(formData.bmi) < 18.5 ? "#f59e0b" :
    parseFloat(formData.bmi) < 25   ? "#10b981" :
    parseFloat(formData.bmi) < 30   ? "#f59e0b" : "#ef4444";

  const bmiLabel = !formData.bmi ? "" :
    parseFloat(formData.bmi) < 18.5 ? "Underweight" :
    parseFloat(formData.bmi) < 25   ? "Normal" :
    parseFloat(formData.bmi) < 30   ? "Overweight" : "Obese";

  return (
    <section className="form-section active">
      <h2 className="section-title"><Icon name="heart-pulse" size={20} />Health Screening Metrics</h2>
      <div className="form-grid">
        <div className="input-group">
          <label>Blood Pressure (mmHg)</label>
          <div className="bp-row">
            <div className="input-wrapper"><Icon name="activity" size={16} className="input-icon" />
              <input type="number" name="bloodPressureSystolic" placeholder="Systolic" value={formData.bloodPressureSystolic} onChange={handle} min="60" max="250" /></div>
            <span className="bp-slash">/</span>
            <div className="input-wrapper">
              <input type="number" name="bloodPressureDiastolic" placeholder="Diastolic" value={formData.bloodPressureDiastolic} onChange={handle} min="40" max="150" /></div>
          </div>
        </div>
        <div className="input-group">
          <label>Blood Sugar (mg/dL)</label>
          <div className="input-wrapper"><Icon name="droplets" size={16} className="input-icon" />
            <input type="number" name="bloodSugar" placeholder="e.g. 95" value={formData.bloodSugar} onChange={handle} min="0" /></div>
        </div>
        <div className="input-group">
          <label>Weight (kg)</label>
          <div className="input-wrapper"><Icon name="scale" size={16} className="input-icon" />
            <input type="number" name="weight" placeholder="e.g. 70" value={formData.weight} onChange={handle} min="1" /></div>
        </div>
        <div className="input-group">
          <label>Height (cm)</label>
          <div className="input-wrapper"><Icon name="ruler" size={16} className="input-icon" />
            <input type="number" name="height" placeholder="e.g. 165" value={formData.height} onChange={handle} min="1" /></div>
        </div>
        <div className="input-group full-width">
          <label>BMI (auto-calculated)</label>
          <div className="bmi-display">
            <div className="input-wrapper"><Icon name="calculator" size={16} className="input-icon" />
              <input type="text" value={formData.bmi} readOnly placeholder="—" style={{ color: bmiColor || "inherit" }} /></div>
            {bmiLabel && <span className="bmi-badge" style={{ background: bmiColor }}>{bmiLabel}</span>}
          </div>
          <p className="field-hint">Calculated automatically from weight and height.</p>
        </div>
        <div className="input-group full-width">
          <label>Known Conditions (type &amp; press Enter)</label>
          <div className="tags-input-container">
            <div className="tags-list">
              {conditions.map((c) => (
                <span key={c} className="tag">{c}
                  <button type="button" className="tag-remove" onClick={() => setConditions(conditions.filter((x) => x !== c))}>&times;</button>
                </span>
              ))}
            </div>
            <input type="text" placeholder="e.g. Hypertension, Diabetes..." className="tags-input"
              value={condInput} onChange={(e) => setCondInput(e.target.value)} onKeyDown={addCond} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Success ───────────────────────────────────────────────────
export function Success({ onReset }) {
  return (
    <div className="success-message">
      <div className="success-icon"><Icon name="check-circle-2" size={48} className="check-icon" /></div>
      <div className="success-brand"><Icon name="shield-plus" size={18} color="#10b981" /><span>BHF DataGuardian</span></div>
      <h2>Record Submitted Successfully!</h2>
      <p>The beneficiary's data has been securely encrypted and stored.</p>
      <button type="button" className="btn btn-primary" onClick={onReset}>Add New Beneficiary</button>
    </div>
  );
}
