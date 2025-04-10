const Tesseract = require("tesseract.js");
const fs = require("fs");
const pdfParse = require("pdf-parse");

async function extractTextFromImageOrPDF(filePath) {
  const ext = filePath.split(".").pop().toLowerCase();

  if (ext === "pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return cleanText(pdfData.text);
  } else {
    const result = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m), // Optional logging
    });
    return cleanText(result.data.text);
  }
}

function cleanText(text) {
  return text
    .split("\n")
    .map((line) => line.trim().replace(/\s{2,}/g, " ")) // collapse extra spaces
    .filter((line) => line.length > 0)
    .join("\n");
}

module.exports = { extractTextFromImageOrPDF };
