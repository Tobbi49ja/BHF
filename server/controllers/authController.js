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