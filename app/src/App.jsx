import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LandingPage    from "./components/LandingPage";
import LoginPage      from "./components/LoginPage";
import Sidebar        from "./components/Sidebar";
import Step1          from "./components/Step1";
import Step2          from "./components/Step2";
import Success        from "./components/Success";
import AdminDashboard from "./components/AdminDashboard";
import NotFound       from "./pages/NotFound";
import Icon           from "./components/Icon";
import { useAuth }    from "./context/AuthContext";
import { submitRecord } from "./services/api";
import "./App.css";

// ── Protected route wrapper ───────────────────────────────────
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

// ── i18n ─────────────────────────────────────────────────────
const headerText = {
  en: { badge: "DataGuardian", title: "Beneficiary Intake Form", sub: "Beyond Health Foundation — Secure, encrypted data collection for community health programs." },
  ha: { badge: "DataGuardian", title: "Fom na Amfanin Masu Amfani", sub: "Gidauniyar Lafiya ta BHF — Tattara bayanai lafiya da sirri." },
  yo: { badge: "DataGuardian", title: "Fọọmu Gbigba Oluranlọwọ", sub: "BHF — Gbigba data ti o ni aabo fun awọn eto ilera agbegbe." },
  ig: { badge: "DataGuardian", title: "Ụdị Natarị Onye Ọrụ", sub: "BHF — Nchịkọta data nchekwa maka mmemme ahụike obodo." },
  fr: { badge: "DataGuardian", title: "Formulaire d'Admission", sub: "BHF — Collecte de données sécurisée pour les programmes de santé communautaire." },
  ar: { badge: "DataGuardian", title: "استمارة قبول المستفيد", sub: "مؤسسة BHF — جمع بيانات آمن ومشفر لبرامج الصحة المجتمعية." },
};

const navText = {
  en: { next: "Next Step",        prev: "Previous",   submit: "Submit Record",    home: "Home",     logout: "Logout" },
  ha: { next: "Mataki na Gaba",   prev: "Baya",        submit: "Aika Bayani",      home: "Gida",     logout: "Fita" },
  yo: { next: "Igbesẹ Ti o Tẹle", prev: "Iṣaaju",     submit: "Firanṣẹ Igbasilẹ", home: "Ile",      logout: "Jade" },
  ig: { next: "Nzọụkwụ Ọzọ",      prev: "Nazaghachi",  submit: "Zipu Ndekọ",       home: "Ulo",      logout: "Pụọ" },
  fr: { next: "Étape Suivante",    prev: "Précédent",   submit: "Soumettre",        home: "Accueil",  logout: "Déconnexion" },
  ar: { next: "الخطوة التالية",    prev: "السابق",      submit: "إرسال السجل",      home: "الرئيسية", logout: "خروج" },
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
  const [currentStep, setCurrentStep] = useState(1);
  const [conditions,  setConditions]  = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData,    setFormData]    = useState(emptyForm);
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done,        setDone]        = useState(false);

  const h     = headerText[lang] || headerText.en;
  const n     = navText[lang]    || navText.en;
  const isRTL = lang === "ar";

  const handleLogout = () => { logout(); window.location.href = "/"; };
  const nextStep = () => { setCurrentStep(2); setSidebarOpen(false); };
  const prevStep = () => { setCurrentStep(1); setSidebarOpen(false); };

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
        onBackToHome={() => { window.location.href = "/"; }}
      />

      <main className="main-content">
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
      <Route path="/" element={<LandingPage
        onStart={() => {
          if (!user) window.location.href = "/login";
          else if (user.role === "Administrator") window.location.href = "/admin";
          else window.location.href = "/form";
        }}
        lang={lang}
        setLang={setLang}
      />} />

      <Route path="/login" element={
        user
          ? <Navigate to={user.role === "Administrator" ? "/admin" : "/form"} replace />
          : <LoginPage
              onSuccess={(data) => {
                window.location.href = data.role === "Administrator" ? "/admin" : "/form";
              }}
              onBack={() => { window.location.href = "/"; }}
              lang={lang}
            />
      } />

      {/* Protected: logged-in users */}
      <Route path="/form" element={
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

      {/* 404 — catches everything else like /hi, /abc, etc */}
      <Route path="*" element={<NotFound onBack={() => { window.location.href = "/"; }} />} />
    </Routes>
  );
}