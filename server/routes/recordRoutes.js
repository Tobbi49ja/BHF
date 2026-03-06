// routes/recordRoutes.js
import express from "express";
import { recordSchema } from "../models/Record.js";
import { createAuthMiddleware } from "../middleware/authMiddleware.js";

export function createRecordRouter(atlasConn, localConn) {
  const { protect } = createAuthMiddleware(atlasConn);  // ← get middleware from connection
  const AtlasRecord = atlasConn.model("Record", recordSchema);
  const LocalRecord = localConn ? localConn.model("Record", recordSchema) : null;

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
      res.status(500).json({ message: error.message });
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