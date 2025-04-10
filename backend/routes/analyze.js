const express = require("express");
const router = express.Router();
const { analyzeReport } = require("../controllers/analyze");

router.post("/analyze", analyzeReport);

module.exports = router;
