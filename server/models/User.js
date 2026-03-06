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