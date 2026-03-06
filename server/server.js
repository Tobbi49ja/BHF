import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB }          from "./config/db.js";
import { createAuthRouter }   from "./routes/authRoutes.js";
import { createAdminRouter }  from "./routes/adminRoutes.js";
import { createRecordRouter } from "./routes/recordRoutes.js";
import { seedAdmin }          from "./controllers/authController.js";
import userSchema             from "./models/User.js";

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.get("/", (_, res) => res.json({ message: "BHF DataGuardian API Running..." }));

const startServer = async () => {
  try {
    const { atlasConnection, localConnection } = await connectDB();

    // Seed admin account from .env on every startup (skips if already exists)
    const User = atlasConnection.model("User", userSchema);
    await seedAdmin(User);

    app.use("/api/auth",    createAuthRouter(atlasConnection));
    app.use("/api/records", createRecordRouter(atlasConnection, localConnection));
    app.use("/api/admin",   createAdminRouter(atlasConnection));

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
