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