import mongoose from "mongoose";

let atlasConnection;
let localConnection;

const connectDB = async () => {
  try {
    const ATLAS_URI = process.env.MONGO_URI;
    const LOCAL_URI = process.env.MONGO_LOCAL_URI;

    if (!ATLAS_URI) throw new Error("MONGO_URI is missing from .env file");

    console.log("🌐 Connecting to Atlas...");
    atlasConnection = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log("✅ Atlas Connected");

    if (LOCAL_URI) {
      console.log("💻 Connecting to Local...");
      localConnection = await mongoose.createConnection(LOCAL_URI).asPromise();
      console.log("✅ Local Connected");
    } else {
      console.log("⚠️  No LOCAL_URI — skipping local DB");
    }

    return { atlasConnection, localConnection };
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1);
  }
};

export { connectDB, atlasConnection, localConnection };
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userSchema from "../models/User.js";

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registerUser = (User) => async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // // Block anyone from self-registering as admin
    // if (role === "Administrator")
    //   return res.status(403).json({ message: "Cannot register as Administrator" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User already exists" });

    let userRole = role;
    if (role === "Administrator") {
      userRole = "Field Volunteer"
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashedPassword, userRole});

    res.status(201).json({
      _id: user._id, fullName: user.fullName,
      email: user.email, role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = (User) => async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    res.json({
      _id: user._id, fullName: user.fullName,
      email: user.email, role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Called once on server start — creates admin from .env if not already exists
export const seedAdmin = async (User) => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NAME) {
    console.warn("⚠️  No admin seed vars found in .env (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME)");
    return;
  }

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log("✅ Admin account already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    fullName: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "Administrator",
  });

  console.log(`✅ Admin account created: ${ADMIN_EMAIL}`);
};
// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import userSchema from "../models/User.js";

export function createAuthMiddleware(atlasConn) {
  const User = atlasConn.model("User", userSchema);

  const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        return next();
      } catch {
        return res.status(401).json({ message: "Not authorized, token failed" });
      }
    }
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });
  };

  const adminOnly = (req, res, next) => {
    if (req.user?.role === "Administrator") return next();
    res.status(403).json({ message: "Access denied: Admins only" });
  };

  return { protect, adminOnly };
}
import mongoose from "mongoose";

export const recordSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    age: { type: Number },
    phone: { type: String, trim: true },
    address: {
      street: { type: String, trim: true, default: "" },
      landmark: { type: String, trim: true, default: "" },
      city: { type: String, trim: true, default: "" },
      lga: { type: String, trim: true, default: "" },
      state: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "Nigeria" },
      full: { type: String, trim: true, default: "" },
    },
    volunteerName: { type: String, trim: true },

    bloodPressureSystolic: { type: Number },
    bloodPressureDiastolic: { type: Number },
    bloodSugar: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    bmi: { type: Number },
    conditions: { type: [String], default: [] },

    lang: { type: String, default: "en" },
    submittedAt: { type: Date, default: Date.now },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Field Volunteer", "Health Worker", "Program Manager", "Data Analyst", "Administrator"],
      default: "Field Volunteer",
    },
  },
  { timestamps: true }
);

export default userSchema;

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
// routes/authRoutes.js
import express from "express";
import userSchema from "../models/User.js";
import { registerUser, loginUser } from "../controllers/authController.js";

export function createAuthRouter(atlasConn) {
  const User = atlasConn.model("User", userSchema);
  const router = express.Router();

  router.post("/register", registerUser(User));
  router.post("/login",    loginUser(User));

  return router;
}
// routes/recordRoutes.js
import express from "express";
import { recordSchema } from "../models/Record.js";
import { createAuthMiddleware } from "../middleware/authMiddleware.js";

export function createRecordRouter(atlasConn, localConn) {
  const { protect } = createAuthMiddleware(atlasConn);

  // { overwrite: true } forces Mongoose to use the current schema
  // instead of any cached version from a previous server run
  const AtlasRecord = atlasConn.model("Record", recordSchema, "records", { overwrite: true });
  const LocalRecord = localConn
    ? localConn.model("Record", recordSchema, "records", { overwrite: true })
    : null;

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
