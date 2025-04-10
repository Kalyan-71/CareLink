const express = require("express");
const router = express.Router();
const voiceController = require("../controllers/voiceController");

router.post("/voice-analyze", voiceController.processVoice);

module.exports = router;
