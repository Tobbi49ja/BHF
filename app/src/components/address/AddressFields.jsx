import { MapPin, ChevronDown, Navigation, Home, Building2, Hash, Globe, Landmark } from 'lucide-react';

export function AddressFields({ address, handlers, derived, errors = {}, disabled = false }) {
  const { states, lgas, cities } = derived;
  const {
    handleStateChange, handleLGAChange, handleCityChange,
    handleStreetChange, handleStreet2Change,
    handleLandmarkChange, handlePostcodeChange,
  } = handlers;

  return (
    <>
      {/* Country – fixed */}
      <div className="input-group">
        <label><Globe size={12} /> Country</label>
        <div className="input-wrapper">
          <Globe className="input-icon" size={16} />
          <input type="text" value="Nigeria" readOnly
            style={{ paddingLeft: "2.75rem", opacity: 0.7, cursor: "default" }} />
        </div>
      </div>

      {/* State */}
      <div className={`input-group ${errors.state ? "has-error" : ""}`}>
        <label htmlFor="addr-state">
          <MapPin size={12} /> State <span style={{ color:"var(--error)" }}>*</span>
        </label>
        <div className="input-wrapper">
          <MapPin className="input-icon" size={16} />
          <select id="addr-state" value={address.state} onChange={handleStateChange} disabled={disabled}>
            <option value="">— Select State —</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="select-arrow" />
        </div>
        {errors.state && <span className="field-error">{errors.state}</span>}
      </div>

      {/* LGA */}
      <div className={`input-group ${errors.lga ? "has-error" : ""}`}>
        <label htmlFor="addr-lga">
          <Navigation size={12} /> Local Government Area <span style={{ color:"var(--error)" }}>*</span>
        </label>
        <div className="input-wrapper">
          <Navigation className="input-icon" size={16} />
          <select id="addr-lga" value={address.lga} onChange={handleLGAChange}
            disabled={disabled || !address.state}>
            <option value="">{!address.state ? "— Select a state first —" : "— Select LGA —"}</option>
            {lgas.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <ChevronDown className="select-arrow" />
        </div>
        {!address.state && <span className="field-hint">Select a state to see its LGAs</span>}
        {errors.lga && <span className="field-error">{errors.lga}</span>}
      </div>

      {/* City / Town within LGA */}
      <div className={`input-group ${errors.city ? "has-error" : ""}`}>
        <label htmlFor="addr-city">
          <Home size={12} /> City / Town <span style={{ color:"var(--error)" }}>*</span>
        </label>
        <div className="input-wrapper">
          <Home className="input-icon" size={16} />
          <select id="addr-city" value={address.city} onChange={handleCityChange}
            disabled={disabled || !address.lga}>
            <option value="">{!address.lga ? "— Select LGA first —" : "— Select City/Town —"}</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="select-arrow" />
        </div>
        {!address.lga && <span className="field-hint">Select an LGA to see its cities</span>}
        {errors.city && <span className="field-error">{errors.city}</span>}
      </div>

      {/* Street Address Line 1 */}
      <div className={`input-group full-width ${errors.street ? "has-error" : ""}`}>
        <label htmlFor="addr-street">
          <MapPin size={12} /> Address Line 1 <span style={{ color:"var(--error)" }}>*</span>
        </label>
        <div className="input-wrapper">
          <MapPin className="input-icon" size={16} />
          <input id="addr-street" type="text" value={address.street}
            onChange={handleStreetChange}
            placeholder="e.g. 12 Ahmadu Bello Way"
            disabled={disabled} maxLength={200} />
        </div>
        {errors.street && <span className="field-error">{errors.street}</span>}
      </div>

      {/* Street Address Line 2 */}
      <div className="input-group full-width">
        <label htmlFor="addr-street2">
          <Building2 size={12} /> Address Line 2
          <span style={{ color:"var(--text-3)", fontWeight:400, marginLeft:"0.25rem" }}>(optional)</span>
        </label>
        <div className="input-wrapper">
          <Building2 className="input-icon" size={16} />
          <input id="addr-street2" type="text" value={address.street2}
            onChange={handleStreet2Change}
            placeholder="e.g. Flat 3B, Unity Estate"
            disabled={disabled} maxLength={200} />
        </div>
      </div>

      {/* Postal Code */}
      <div className="input-group">
        <label htmlFor="addr-postcode">
          <Hash size={12} /> Postal Code
          <span style={{ color:"var(--text-3)", fontWeight:400, marginLeft:"0.25rem" }}>(optional)</span>
        </label>
        <div className="input-wrapper">
          <Hash className="input-icon" size={16} />
          <input id="addr-postcode" type="text" value={address.postcode}
            onChange={handlePostcodeChange}
            placeholder="e.g. 100001"
            disabled={disabled} maxLength={10} />
        </div>
      </div>

      {/* Nearest Landmark */}
      <div className="input-group">
        <label htmlFor="addr-landmark">
          <Landmark size={12} /> Nearest Landmark
          <span style={{ color:"var(--text-3)", fontWeight:400, marginLeft:"0.25rem" }}>(optional)</span>
        </label>
        <div className="input-wrapper">
          <Landmark className="input-icon" size={16} />
          <input id="addr-landmark" type="text" value={address.landmark}
            onChange={handleLandmarkChange}
            placeholder="e.g. Opposite Unity Bank"
            disabled={disabled} maxLength={200} />
        </div>
      </div>

      {/* Full Address Preview */}
      {derived.isAddressComplete && (
        <div className="input-group full-width">
          <label><MapPin size={12} /> Address Preview</label>
          <div className="address-preview">
            <MapPin size={14} style={{ flexShrink:0, color:"var(--success)" }} />
            <span>{derived.fullAddress}</span>
          </div>
        </div>
      )}
    </>
  );
}