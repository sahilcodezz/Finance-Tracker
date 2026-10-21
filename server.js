const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

// Ensure MongoDB Atlas SRV lookups work reliably on Windows/local networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err.message));
} else {
  console.log("⚠️  Warning: MONGO_URI is not set. Please create a .env file with MONGO_URI.");
}

app.use("/api/auth", require("./backend/routes/authRoutes"));
app.use("/api/transactions", require("./backend/routes/transactionRoutes"));

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Finance Tracker API Running");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});