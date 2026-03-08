import { useState, useEffect } from "react";
import Icon from "./Icon";
import { saveCookieConsent } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CookieBanner() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("bhf_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const handle = async (accepted) => {
    localStorage.setItem("bhf_cookie_consent", accepted ? "accepted" : "declined");
    setVisible(false);
    if (user) {
      try { await saveCookieConsent(user.token, accepted); } catch {}
    }
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-inner">
        <div className="cookie-icon">
          <Icon name="shield-check" size={18} color="#10b981" />
        </div>
        <p className="cookie-text">
          We use cookies for site functionality and to improve your experience.
          See our <a href="#" className="cookie-link">Privacy Policy</a>.
        </p>
        <div className="cookie-actions">
          <button className="cookie-btn cookie-decline" onClick={() => handle(false)}>
            Decline
          </button>
          <button className="cookie-btn cookie-accept" onClick={() => handle(true)}>
            Accept
          </button>
        </div>
        <button className="cookie-dismiss" onClick={() => handle(false)}>
          <Icon name="x" size={14} />
        </button>
      </div>
    </div>
  );
}