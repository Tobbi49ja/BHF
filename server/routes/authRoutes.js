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