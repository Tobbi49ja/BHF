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