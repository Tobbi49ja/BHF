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