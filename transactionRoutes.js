const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// CREATE
router.post("/", async (req, res) => {
  try {
    const { type, description, amount } = req.body;

    const newTransaction = new Transaction({
      type,
      description,
      amount,
      date: new Date()
    });

    const savedTransaction = await newTransaction.save();

    return res.status(201).json(savedTransaction);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});


// GET (THIS WAS MISSING)
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;