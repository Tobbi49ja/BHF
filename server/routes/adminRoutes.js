// routes/adminRoutes.js
import express from "express";
import ExcelJS from "exceljs";
import userSchema from "../models/User.js";
import { recordSchema } from "../models/Record.js";
import { createAuthMiddleware } from "../middleware/authMiddleware.js";

export function createAdminRouter(atlasConn) {
  const { protect, adminOnly } = createAuthMiddleware(atlasConn);  // ← from connection
  const User = atlasConn.model("User", userSchema);
  const AtlasRecord = atlasConn.model("Record", recordSchema);

  const router = express.Router();
  router.use(protect, adminOnly);

  router.get("/users", async (req, res) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  });

  router.delete("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    res.json({ message: "User deleted" });
  });

  router.put("/users/:id/role", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = req.body.role;
    await user.save();
    res.json({ message: "Role updated", user });
  });

  router.get("/records", async (req, res) => {
    try {
      const records = await AtlasRecord.find()
        .populate("submittedBy", "fullName email role")
        .sort({ createdAt: -1 });
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get("/records/export", async (req, res) => {
    try {
      const records = await AtlasRecord.find()
        .populate("submittedBy", "fullName email role")
        .sort({ createdAt: -1 });

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Beneficiary Records");

      sheet.columns = [
        { header: "First Name",   key: "firstName",              width: 16 },
        { header: "Last Name",    key: "lastName",               width: 16 },
        { header: "Gender",       key: "gender",                 width: 12 },
        { header: "Age",          key: "age",                    width: 8  },
        { header: "Phone",        key: "phone",                  width: 18 },
        { header: "Address",      key: "address",                width: 28 },
        { header: "Volunteer",    key: "volunteerName",          width: 20 },
        { header: "BP Systolic",  key: "bloodPressureSystolic",  width: 12 },
        { header: "BP Diastolic", key: "bloodPressureDiastolic", width: 12 },
        { header: "Blood Sugar",  key: "bloodSugar",             width: 12 },
        { header: "Weight (kg)",  key: "weight",                 width: 12 },
        { header: "Height (cm)",  key: "height",                 width: 12 },
        { header: "BMI",          key: "bmi",                    width: 10 },
        { header: "Conditions",   key: "conditions",             width: 30 },
        { header: "Submitted By", key: "submittedByName",        width: 20 },
        { header: "Submitted At", key: "submittedAt",            width: 22 },
      ];

      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF10B981" } };
      headerRow.height = 22;

      records.forEach((r) => {
        sheet.addRow({
          firstName: r.firstName,               lastName: r.lastName,
          gender: r.gender,                     age: r.age,
          phone: r.phone,                       address: r.address,
          volunteerName: r.volunteerName,
          bloodPressureSystolic: r.bloodPressureSystolic,
          bloodPressureDiastolic: r.bloodPressureDiastolic,
          bloodSugar: r.bloodSugar,             weight: r.weight,
          height: r.height,                     bmi: r.bmi,
          conditions: (r.conditions || []).join(", "),
          submittedByName: r.submittedBy?.fullName || "—",
          submittedAt: r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—",
        });
      });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="BHF_Records_${Date.now()}.xlsx"`);
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
}