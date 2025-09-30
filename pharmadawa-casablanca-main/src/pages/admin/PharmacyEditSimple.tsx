import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PharmacyEditSimple = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "صيدلية تجريبية",
    address: "الدار البيضاء",
    phone: "0600000000",
    workingHours: "8:00 ص - 9:00 م",
  });

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate("/admin/dashboard")}>
        ← العودة
      </button>
      
      <h1 style={{ marginTop: "20px" }}>تعديل معلومات الصيدلية</h1>
      
      <form style={{ marginTop: "30px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>اسم الصيدلية</label>
          <br />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>العنوان</label>
          <br />
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>رقم الهاتف</label>
          <br />
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>ساعات العمل</label>
          <br />
          <input
            type="text"
            value={formData.workingHours}
            onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            alert("تم الحفظ: " + JSON.stringify(formData));
            console.log("Saved data:", formData);
          }}
          style={{ padding: "10px 20px", background: "#0066cc", color: "white", border: "none", cursor: "pointer" }}
        >
          حفظ التغييرات
        </button>
      </form>

      <div style={{ marginTop: "30px", padding: "15px", background: "#f0f0f0", borderRadius: "5px" }}>
        <h3>البيانات الحالية:</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default PharmacyEditSimple;
