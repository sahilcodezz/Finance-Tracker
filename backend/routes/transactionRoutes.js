const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Transaction = require("../models/Transaction");

// Helper to optionally extract user ID from auth header
const getUserId = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.id;
    }
  } catch (err) {
    // If token is missing/expired, proceed without userId for backward compatibility
  }
  return null;
};

// CREATE TRANSACTION
router.post("/", async (req, res) => {
  try {
    const { type, description, amount, date } = req.body;
    const userId = getUserId(req);

    const newTransaction = new Transaction({
      userId: userId || undefined,
      type,
      description,
      amount: Number(amount),
      date: date ? new Date(date) : new Date()
    });

    const savedTransaction = await newTransaction.save();
    return res.status(201).json(savedTransaction);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// GET TRANSACTIONS (Newest first, optionally filtered by user)
router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    // If authenticated, show user's transactions plus any legacy transactions without userId
    const filter = userId
      ? { $or: [{ userId }, { userId: { $exists: false } }, { userId: null }] }
      : {};

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE TRANSACTION
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;