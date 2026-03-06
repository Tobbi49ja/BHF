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