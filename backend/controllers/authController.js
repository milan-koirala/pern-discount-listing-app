import { sql } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await sql`SELECT * FROM shops WHERE email = ${email}`;
    const shop = result[0];
    if (!shop) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, shop.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const payload = { shop_id: shop.id, shop_name: shop.shop_name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    delete shop.password_hash;
    const shopData = { id: shop.id, shop_name: shop.shop_name, email: shop.email };

    return res.status(200).json({ success: true, data: shopData });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

// GET /api/auth/check-auth
export const checkAuth = (req, res) => {
  if (req.shop) {
    return res.status(200).json({ success: true, data: req.shop });
  }
  return res.status(401).json({ success: false, message: "Not authenticated" });
};
