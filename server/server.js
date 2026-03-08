import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { connectDB }          from "./config/db.js";
import { recordSchema }       from "./models/Record.js";
import userSchema             from "./models/User.js";
import messageSchema          from "./models/Message.js";
import { seedAdmin }          from "./controllers/authController.js";

import { createAuthRouter }   from "./routes/authRoutes.js";
import { createAdminRouter }  from "./routes/adminRoutes.js";
import { createRecordRouter } from "./routes/recordRoutes.js";
import { createChatRouter }   from "./routes/chatRoutes.js";

const app        = express();
const httpServer = createServer(app);
const io         = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] },
  allowEIO3: true,
});
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.set("io", io);

app.get("/", (_, res) => res.json({ message: "BHF DataGuardian API Running..." }));

// ── Socket.IO ────────────────────────────────────────────────
const onlineUsers = new Map(); // userId → socketId

io.on("connection", (socket) => {
  console.log(`[socket] client connected: ${socket.id}`);

  socket.on("join", (userId) => {
    const uid = String(userId);
    // If this socket already joined this room, ignore
    if (socket.rooms.has(uid)) {
      console.log(`[socket] user ${uid} already in room — skipping duplicate join`);
      return;
    }
    onlineUsers.set(uid, socket.id);
    socket.join(uid);
    console.log(`[socket] user ${uid} joined room (socket ${socket.id})`);
    io.emit("userStatus", { userId: uid, status: "active" });
  });

  socket.on("idle", (userId) => {
    const uid = String(userId);
    console.log(`[socket] user ${uid} idle`);
    io.emit("userStatus", { userId: uid, status: "idle" });
  });

  socket.on("disconnect", () => {
    for (const [userId, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(userId);
        console.log(`[socket] user ${userId} disconnected`);
        io.emit("userStatus", { userId, status: "offline" });
        break;
      }
    }
  });

  socket.on("ping_user", ({ targetId, adminName }) => {
    const tid = String(targetId);
    console.log(`[socket] ping_user → room "${tid}" from "${adminName}"`);
    io.to(tid).emit("pinged", {
      adminName,
      message: `📣 ${adminName} is pinging you!`,
    });
  });
});

// ── Start ────────────────────────────────────────────────────
const startServer = async () => {
  try {
    const { atlasConnection, localConnection } = await connectDB();

    const User        = atlasConnection.model("User",    userSchema);
    const AtlasRecord = atlasConnection.model("Record",  recordSchema);
    const AtlasMessage = atlasConnection.model("Message", messageSchema);
    const LocalRecord = localConnection
      ? localConnection.model("Record", recordSchema)
      : null;

    await seedAdmin(User);

    app.use("/api/auth",    createAuthRouter(User));
    app.use("/api/records", createRecordRouter(AtlasRecord, LocalRecord, atlasConnection));
    app.use("/api/admin",   createAdminRouter(AtlasRecord, User, atlasConnection));
    app.use("/api/chat",    createChatRouter(AtlasMessage, User, atlasConnection));

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();