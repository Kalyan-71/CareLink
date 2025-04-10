const analyzeSymptoms = require("../utils/analyzeSymptoms");

exports.processVoice = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  try {
    const result = await analyzeSymptoms(text);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze symptoms" });
  }
};
