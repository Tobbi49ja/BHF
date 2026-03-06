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