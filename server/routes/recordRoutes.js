import express from "express";
import { createAuthMiddleware } from "../middleware/authMiddleware.js";

export function createRecordRouter(AtlasRecord, LocalRecord, atlasConn) {
  const { protect } = createAuthMiddleware(atlasConn);
  const router = express.Router();

  router.post("/", protect, async (req, res) => {
    try {
      const payload = { ...req.body, submittedBy: req.user._id };
      const record = await AtlasRecord.create(payload);
      if (LocalRecord) {
        LocalRecord.create(payload).catch((e) =>
          console.warn("⚠️  Local mirror failed:", e.message)
        );
      }
      res.status(201).json({ message: "Record saved", record });
    } catch (error) {
      console.error("Record save error:", error.message);
      const status = error.name === "ValidationError" ? 400 : 500;
      res.status(status).json({ message: error.message });
    }
  });

  router.get("/", protect, async (req, res) => {
    try {
      const records = await AtlasRecord.find()
        .populate("submittedBy", "fullName email role")
        .sort({ createdAt: -1 });
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
}