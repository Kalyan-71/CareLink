const express= require("express");
const Medicine = require("../models/Medicine.js");

const router = express.Router();

// Add new medicine
router.post("/", async (req, res) => {
  try {
    const userId = req.header("X-User-Id");
    const newMedicine = new Medicine({ ...req.body, userId });
    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (err) {
    res.status(500).json({ message: "Error adding medicine" });
  }
});

// Get all medicines for user
router.get("/:userId/medicines", async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.params.userId });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: "Error fetching medicines" });
  }
});

module.exports = router;
