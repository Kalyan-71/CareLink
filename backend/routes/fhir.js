const express = require("express");
const router = express.Router();
const { createPatient } = require("../fhirClient");

router.post("/add-patient", async (req, res) => {
  try {
    const patient = await createPatient(req.body);
    res.status(201).json(patient);
  } catch (err) {
    console.error("Error creating patient:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create patient" });
  }
});

module.exports = router;
