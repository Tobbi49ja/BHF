import mongoose from "mongoose";

export const recordSchema = new mongoose.Schema(
  {
    // Step 1 — Beneficiary Profile
    firstName:     { type: String, required: true, trim: true },
    lastName:      { type: String, required: true, trim: true },
    gender:        { type: String, enum: ["male", "female", "prefer not to say"] },
    age:           { type: Number, min: 1, max: 120 },
    phone:         { type: String, trim: true },
    address:       { type: String, trim: true },
    volunteerName: { type: String, trim: true },

    // Step 2 — Health Screening
    bloodPressureSystolic:  { type: Number },
    bloodPressureDiastolic: { type: Number },
    bloodSugar:  { type: Number },
    weight:      { type: Number },
    height:      { type: Number },
    bmi:         { type: String },
    conditions:  [{ type: String }],

    // Meta
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    submittedAt: { type: Date, default: Date.now },
    lang:        { type: String, default: "en" },
  },
  { timestamps: true }
);