// backend/server.js

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import shopRoute from "./routes/shopRoute.js";
import authRoute from "./routes/authRoute.js";
import discountRoutes from "./routes/discountRoute.js";

import { sql } from "./config/db.js";

// Optional: Arcjet rate limiting
import { aj } from "./lib/arcjet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Allow frontend access (adjust CLIENT_URL as needed)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));

// Optional Arcjet protection
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ error: "Bot access denied" });
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    const spoofedBot = decision.results.some(
      (r) => r.reason.isBot() && r.reason.isSpoofed()
    );

    if (spoofedBot) {
      return res.status(403).json({ error: "Spoofed bot detected" });
    }

    next();
  } catch (err) {
    console.error("Arcjet error:", err);
    next(err);
  }
});

// === IMPORTANT: Disable caching for all API responses to avoid 304 ===
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// API routes
app.use("/api/shops", shopRoute);
app.use("/api/discounts", discountRoutes);
app.use("/api/auth", authRoute);

// Database initialization
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS shops (
        id SERIAL PRIMARY KEY,
        shop_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        city VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS discounts (
        id SERIAL PRIMARY KEY,
        shop_id INTEGER REFERENCES shops(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        discount_percentage NUMERIC(5,2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
        category VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  }
}

// Start server
initDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
  );
});
