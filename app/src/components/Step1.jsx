import { useEffect } from "react";
import Icon from "./Icon";
import { useNigeriaAddress } from "../hooks/useNigeriaAddress";
import { AddressFields } from "./address/AddressFields";

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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const { address, handlers, derived } = useNigeriaAddress(formData.address || {});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      address: {
        street:   address.street,
        street2:  address.street2,
        landmark: address.landmark,
        city:     address.city,
        lga:      address.lga,
        state:    address.state,
        postcode: address.postcode,
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
            <input type="text" id="firstName" name="firstName"
              placeholder={i18n.placeholders.firstName}
              value={formData.firstName} onChange={handleChange} required />
          </div>
        </div>

        {/* Last Name */}
        <div className="input-group">
          <label htmlFor="lastName">{i18n.lastName}</label>
          <div className="input-wrapper">
            <Icon name="user" size={16} className="input-icon" />
            <input type="text" id="lastName" name="lastName"
              placeholder={i18n.placeholders.lastName}
              value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        {/* Gender */}
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

        {/* Age */}
        <div className="input-group">
          <label htmlFor="age">{i18n.age}</label>
          <div className="input-wrapper">
            <Icon name="calendar" size={16} className="input-icon" />
            <input type="number" id="age" name="age"
              placeholder={i18n.placeholders.age} min="1" max="120"
              value={formData.age} onChange={handleChange} required />
          </div>
        </div>

        {/* Phone */}
        <div className="input-group">
          <label htmlFor="phone">{i18n.phone}</label>
          <div className="input-wrapper">
            <Icon name="phone" size={16} className="input-icon" />
            <input type="tel" id="phone" name="phone"
              placeholder={i18n.placeholders.phone}
              value={formData.phone} onChange={handleChange} />
          </div>
        </div>

        {/* Address fields */}
        <AddressFields address={address} handlers={handlers} derived={derived} />

        {/* Volunteer Name */}
        <div className="input-group full-width">
          <label htmlFor="volunteerName">{i18n.volunteerName}</label>
          <div className="input-wrapper">
            <Icon name="badge-check" size={16} className="input-icon" />
            <input type="text" id="volunteerName" name="volunteerName"
              placeholder={i18n.placeholders.volunteerName}
              value={formData.volunteerName} onChange={handleChange} required />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Step1;