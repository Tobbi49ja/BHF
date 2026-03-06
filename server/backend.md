import mongoose from "mongoose";

let atlasConnection;
let localConnection;

const connectDB = async () => {
  try {
    const ATLAS_URI = process.env.MONGO_URI;
    const LOCAL_URI = process.env.MONGO_LOCAL_URI;

    if (!ATLAS_URI) {
      throw new Error("MONGO_URI is missing from .env file");
    }

    console.log("🌐 Connecting to Atlas...");
    atlasConnection = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log("✅ Atlas Connected");

    console.log("💻 Connecting to Local...");
    localConnection = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log("✅ Local Connected");

    return { atlasConnection, localConnection };

  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};

export { connectDB, atlasConnection, localConnection };
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "Administrator") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admin only" });
  }
};
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "Field Volunteer",
        "Health Worker",
        "Program Manager",
        "Data Analyst",
        "Administrator",
      ],
      default: "Field Volunteer",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all users
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// DELETE user
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
});

// UPDATE user role
router.put("/users/:id/role", protect, adminOnly, async (req, res) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = role;
  await user.save();

  res.json({ message: "Role updated successfully", user });
});

export default router;
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
// ─────────────────────────────────────────────────────────────
//  server/routes/recordRoutes.js
//
//  In server.js add AFTER connectDB() resolves:
//
//    import { createRecordRouter } from "./routes/recordRoutes.js";
//    const recordRoutes = createRecordRouter(atlasConnection, localConnection);
//    app.use("/api/records", recordRoutes);
// ─────────────────────────────────────────────────────────────
import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";

// ── Schema (defined once, reused on both connections) ─────────
const recordSchema = new mongoose.Schema(
  {
    // Step 1 — Beneficiary Profile
    firstName:    { type: String, required: true, trim: true },
    lastName:     { type: String, required: true, trim: true },
    gender:       { type: String, enum: ["male", "female", "prefer not to say"] },
    age:          { type: Number, min: 1, max: 120 },
    phone:        { type: String, trim: true },
    address:      { type: String, trim: true },
    volunteerName:{ type: String, trim: true },

    // Step 2 — Health Screening
    bloodPressureSystolic:  { type: Number },
    bloodPressureDiastolic: { type: Number },
    bloodSugar:   { type: Number },
    weight:       { type: Number },
    height:       { type: Number },
    bmi:          { type: String },
    conditions:   [{ type: String }],

    // Meta
    submittedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    submittedAt:  { type: Date, default: Date.now },
    lang:         { type: String, default: "en" },
  },
  { timestamps: true }
);

// ── Factory: receives live connections from server.js ─────────
export function createRecordRouter(atlasConn, localConn) {
  // Models are created HERE — connections are guaranteed to exist
  const AtlasRecord = atlasConn.model("Record", recordSchema);
  const LocalRecord = localConn
    ? localConn.model("Record", recordSchema)
    : null;

  const router = express.Router();

  // POST /api/records — save new beneficiary record
  router.post("/", protect, async (req, res) => {
    try {
      const payload = { ...req.body, submittedBy: req.user._id };

      // Primary save — Atlas
      const record = await AtlasRecord.create(payload);

      // Mirror to local (non-blocking, won't fail the request)
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

  // GET /api/records — list all records (managers/admins)
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
export const syncCollection = async (atlasModel, localModel) => {
  console.log("🔄 Starting Sync...");

  const atlasDocs = await atlasModel.find();
  const localDocs = await localModel.find();

  const localMap = new Map();
  localDocs.forEach((doc) => {
    localMap.set(doc._id.toString(), doc);
  });

  for (const atlasDoc of atlasDocs) {
    const localDoc = localMap.get(atlasDoc._id.toString());

    if (!localDoc) {
      // Insert missing
      await localModel.create(atlasDoc.toObject());
      console.log("➕ Added missing doc to Local");
    } else if (atlasDoc.updatedAt > localDoc.updatedAt) {
      // Update newer
      await localModel.findByIdAndUpdate(atlasDoc._id, atlasDoc.toObject());
      console.log("♻ Updated Local with newer Atlas version");
    }
  }

  console.log("✅ Sync Completed");
};
// server.js
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8", "8.8.4.4"]);

import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB }           from "./config/db.js";
import authRoutes              from "./routes/authRoutes.js";
import adminRoutes             from "./routes/adminRoutes.js";
import { createRecordRouter }  from "./routes/recordRoutes.js";  // ← factory
import { protect, adminOnly }  from "./middleware/authMiddleware.js";

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ── Public routes (no auth needed) ───────────────────────────
app.use("/api/auth",  authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/admin/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin", user: req.user });
});

app.get("/", (req, res) => {
  res.json({ message: "BHF DataGuardian API Running..." });
});

// ── Start: connect DB first, THEN register record routes ─────
const startServer = async () => {
  try {
    const { atlasConnection, localConnection } = await connectDB();

    // Register record routes NOW — connections are live
    const recordRoutes = createRecordRouter(atlasConnection, localConnection);
    app.use("/api/records", recordRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();