const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

// Ensure MongoDB Atlas SRV lookups work reliably on Windows/local networks without crashing in Linux/Render
if (process.env.NODE_ENV !== "production") {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (err) {
    console.warn("Notice: Custom DNS servers could not be set:", err.message);
  }
}

const app = express();

// Flexible CORS configuration for Vercel deployment + local dev
const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = clientUrl
  ? clientUrl.split(",").map((url) => url.trim().replace(/\/+$/, ""))
  : "*";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, Postman, server-to-server)
      if (!origin || allowedOrigins === "*" || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Allow any Vercel preview or production deployment domain
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      // Permissive fallback so new preview deployments are never blocked
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// Health Check Endpoints (Vital for Render free-tier wakeups and uptime monitors)
app.get("/", (req, res) => {
  res.status(200).json({
    name: "Finance Tracker API",
    status: "online",
    healthCheck: "/api/health",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: "healthy",
    uptime: `${Math.floor(process.uptime())}s`,
    database: isDbConnected ? "connected" : "connecting/disconnected",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: "healthy",
    uptime: `${Math.floor(process.uptime())}s`,
    database: isDbConnected ? "connected" : "connecting/disconnected",
    timestamp: new Date().toISOString()
  });
});

// Database connection
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));
} else {
  console.warn("⚠️  Warning: MONGO_URI is not set. Please set MONGO_URI in your environment variables.");
}

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});