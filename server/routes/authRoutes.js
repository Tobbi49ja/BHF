import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

export function createAuthRouter(User) {
  const router = express.Router();
  router.post("/register", registerUser(User));
  router.post("/login",    loginUser(User));
  return router;
}