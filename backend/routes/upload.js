const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { extractTextFromImageOrPDF } = require("../controllers/ocr");
const { parseLabReport } = require("../utils/reportParser");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/upload-report", upload.single("report"), async (req, res) => {
  try {
    const text = await extractTextFromImageOrPDF(req.file.path);
    const structuredData = parseLabReport(text);
    res.json({ extractedText: structuredData });
  } catch (err) {
    console.error("OCR Error:", err);
    res.status(500).json({ error: "Failed to extract text from report" });
  }
});

module.exports = router;
