import express from "express";
import mongoose from "mongoose";
import { createAuthMiddleware } from "../middleware/authMiddleware.js";

export function createChatRouter(AtlasMessage, AtlasUser, atlasConn) {
  const { protect, adminOnly } = createAuthMiddleware(atlasConn);
  const router = express.Router();

  // ── Unread count (MUST be before /messages/:userId) ──────
  router.get("/messages/unread/count", protect, async (req, res) => {
    try {
      const count = await AtlasMessage.countDocuments({
        receiver: req.user._id,
        read: false,
      });
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // ── Get conversation ──────────────────────────────────────
  router.get("/messages/:userId", protect, async (req, res) => {
    try {
      const { userId } = req.params;
      const me = req.user._id;
      const messages = await AtlasMessage.find({
        $or: [
          { sender: me,     receiver: userId },
          { sender: userId, receiver: me     },
        ],
      })
        .populate("sender",   "fullName role")
        .populate("receiver", "fullName role")
        .sort({ createdAt: 1 });

      await AtlasMessage.updateMany(
        { sender: userId, receiver: me, read: false },
        { read: true }
      );

      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // ── Send message ──────────────────────────────────────────
  router.post("/messages", protect, async (req, res) => {
    try {
      const { receiverId, content, type = "message" } = req.body;
      if (!receiverId || !content)
        return res.status(400).json({ message: "receiverId and content required" });

      const msg = await AtlasMessage.create({
        sender:   req.user._id,
        receiver: receiverId,
        content,
        type,
      });

      const populated = await msg.populate([
        { path: "sender",   select: "fullName role" },
        { path: "receiver", select: "fullName role" },
      ]);

      const io = req.app.get("io");
      if (io) {
        const rid = String(receiverId);
        const sid = String(req.user._id);
        console.log(`[chat] emit newMessage → receiver ${rid}, sender ${sid}`);
        io.to(rid).emit("newMessage", populated);
        // Also echo to sender so their chat panel updates in real time
        if (rid !== sid) io.to(sid).emit("newMessage", populated);
      }

      res.status(201).json(populated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // ── Admin: all conversations with unread counts ───────────
  router.get("/admin/conversations", protect, adminOnly, async (req, res) => {
    try {
      const users = await AtlasUser.find({ role: { $ne: "Administrator" } })
        .select("-password")
        .sort({ lastSeen: -1 });

      const conversations = await Promise.all(
        users.map(async (u) => {
          const lastMsg = await AtlasMessage.findOne({
            $or: [
              { sender: u._id, receiver: req.user._id },
              { sender: req.user._id, receiver: u._id },
            ],
          }).sort({ createdAt: -1 });

          const unread = await AtlasMessage.countDocuments({
            sender: u._id,
            receiver: req.user._id,
            read: false,
          });

          return { user: u, lastMessage: lastMsg, unread };
        })
      );

      res.json(conversations);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // ── Admin ID (for users to know who to message) ───────────
  router.get("/admin/id", protect, async (req, res) => {
    try {
      const admin = await AtlasUser.findOne({ role: "Administrator" }).select("_id fullName");
      if (!admin) return res.status(404).json({ message: "No admin found" });
      res.json(admin);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // ── Update user status ────────────────────────────────────
  router.put("/status", protect, async (req, res) => {
    try {
      const { status } = req.body;
      await AtlasUser.findByIdAndUpdate(req.user._id, { status, lastSeen: new Date() });
      const io = req.app.get("io");
      if (io) io.emit("userStatus", { userId: req.user._id, status });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.delete("/messages/clear/:userId", protect, adminOnly, async (req, res) => {
    try {
      const rawUserId  = req.params.userId;
      const rawAdminId = String(req.user._id);

      console.log(`[chat/clear] admin=${rawAdminId} user=${rawUserId}`);

      if (!mongoose.Types.ObjectId.isValid(rawUserId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }

      const userId  = new mongoose.Types.ObjectId(rawUserId);
      const adminId = req.user._id; // ObjectId from protect middleware

      // Log what we're about to delete
      const before = await AtlasMessage.countDocuments({
        $or: [
          { sender: adminId, receiver: userId },
          { sender: userId,  receiver: adminId },
        ],
      });
      console.log(`[chat/clear] found ${before} messages to delete`);

      const result = await AtlasMessage.deleteMany({
        $or: [
          { sender: adminId, receiver: userId },
          { sender: userId,  receiver: adminId },
        ],
      });

      console.log(`[chat/clear] deleted ${result.deletedCount} messages`);

      const io = req.app.get("io");
      if (io) {
        io.to(rawUserId).emit("chatCleared");
        console.log(`[chat/clear] chatCleared → room ${rawUserId}`);
      }

      res.json({ ok: true, deleted: result.deletedCount });
    } catch (err) {
      console.error("[chat/clear] ERROR:", err.message, err.stack);
      res.status(500).json({ message: err.message });
    }
  });

  // ── Cookie consent ────────────────────────────────────────
  router.put("/cookie-consent", protect, async (req, res) => {
    try {
      const { accepted } = req.body;
      await AtlasUser.findByIdAndUpdate(req.user._id, { cookieConsent: accepted });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
}