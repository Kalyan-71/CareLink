// routes/aiSuggestions.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const { Translate } = require("@google-cloud/translate").v2;

const apiKey = "AIzaSyBFRICenemxKbj5WwRIyf1HAs-mQWFbaos";
const translate = new Translate({
  keyFilename: process.env.GOOGLE_TRANSLATE_CREDENTIALS,
}); // Uses credentials from GOOGLE_APPLICATION_CREDENTIALS

router.post("/", async (req, res) => {
  const { text, language = "en" } = req.body;

  console.log("User input:", text);
  console.log("Target language:", language);

  const prompt = `I am experiencing ${text}. Please suggest:
1. Natural remedies to recover.
2. Foods that are good (including fruits).
3. Foods to avoid.
4. Daily exercises or lifestyle routines that help.
Give suggestions in simple bullet points. (Don't use asterisks(*) in response and can use emojis)`;

  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const rawSuggestion =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No suggestion found.";
    console.log("💡 Gemini Suggestion:", rawSuggestion);

    // Translate if needed
    let finalSuggestion = rawSuggestion;
    if (language !== "en") {
      try {
        const [translated] = await translate.translate(rawSuggestion, language);
        finalSuggestion = translated;
        console.log("🌐 Translated Suggestion:", finalSuggestion);
      } catch (translateError) {
        console.warn(
          "Translation failed, falling back to English:",
          translateError.message
        );
      }
    }

    res.json({ suggestion: finalSuggestion });
  } catch (err) {
    console.error("❌ Gemini error:", err.response?.data || err.message);
    res.status(500).json({ error: "Gemini API failed." });
  }
});

module.exports = router;
