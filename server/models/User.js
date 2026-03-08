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
    status:       { type: String, enum: ["active", "idle", "offline"], default: "offline" },
    lastSeen:     { type: Date, default: Date.now },
    cookieConsent: { type: Boolean, default: null },
  },
  { timestamps: true }
);

export default userSchema;