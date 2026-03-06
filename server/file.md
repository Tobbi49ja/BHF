here are all my files backend
i have this folder path in my server/
// 
config/
controllers/
middleware/
models/
routes/
utils/
//

// config/db.js
// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is missing from .env file");
    }

    // Safe log (hides password)
    console.log("🌐 Trying Atlas...");
    console.log("URI:", uri.replace(/:\/\/.*@/, "://<BHF:******>@"));

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 25000,   // 25 seconds (important for Abuja)
      socketTimeoutMS: 60000,
    });

    console.log(`✅ ATLAS CONNECTED SUCCESSFULLY`);
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    return conn;

  } catch (error) {
    console.error("❌ ATLAS FAILED");
    console.error("Error Type :", error.name);
    console.error("Message   :", error.message);
    console.error("Code      :", error.code || "N/A");

    // === FALLBACK TO LOCAL ===
    console.log("🔄 Falling back to Local MongoDB...");
    const LOCAL_URI = process.env.MONGO_LOCAL_URI || "mongodb://127.0.0.1:27017/BHF";

    const conn = await mongoose.connect(LOCAL_URI);
    console.log(`✅ LOCAL CONNECTED: ${conn.connection.host}`);
    return conn;
  }
};

export default connectDB;

<!-- server.js -->
// server.js
import dns from "node:dns";

// 🔥 FIX FOR ATLAS DNS ISSUE (very common in Nigeria)
dns.setServers(["1.1.1.1", "8.8.8.8", "8.8.4.4"]);

import "dotenv/config";           // Best way for ESM projects
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Connect to Database (Atlas → Local fallback)
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "BHF DataGuardian API Running..." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

these are all the files for now
so far phase   1 completed 


DEVELOPMENT PLAN (Step-by-Step Execution)
PHASE 1 — Backend Foundation

Setup Express server

Connect MongoDB Atlas

Setup environment variables

Setup folder structure

PHASE 2 — Authentication

User model

Register route

Login route

JWT middleware

Role middleware

PHASE 3 — Records API

Create record

Get all records

Soft delete

Restore

Filter endpoints

PHASE 4 — Excel Export

Admin-only route

Generate xlsx file

Send file to frontend

PHASE 5 — Connect Frontend

Replace fake success login

Connect real API

Protect routes

Create Admin page