import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street:   { type: String, trim: true, default: "" },
  street2:  { type: String, trim: true, default: "" },
  landmark: { type: String, trim: true, default: "" },
  city:     { type: String, trim: true, default: "" },
  lga:      { type: String, trim: true, default: "" },
  state:    { type: String, trim: true, default: "" },
  postcode: { type: String, trim: true, default: "" },
  country:  { type: String, trim: true, default: "Nigeria" },
  full:     { type: String, trim: true, default: "" },
}, { _id: false });

export const recordSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    gender:    { type: String, enum: ["male", "female", "other"] },
    age:       { type: Number },
    phone:     { type: String, trim: true },

    address: { type: addressSchema, default: () => ({}) },

    volunteerName:          { type: String, trim: true },
    bloodPressureSystolic:  { type: Number },
    bloodPressureDiastolic: { type: Number },
    bloodSugar:             { type: Number },
    weight:                 { type: Number },
    height:                 { type: Number },
    bmi:                    { type: Number },
    conditions:             { type: [String], default: [] },

    lang:        { type: String, default: "en" },
    submittedAt: { type: Date, default: Date.now },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);