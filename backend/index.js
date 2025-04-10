const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const startCronJobs = require("./cron/remainderCron.js"); // Adjust path as needed
dotenv.config();

const app = express();

app.use(cors()); // to enable cross origin resource sharing
app.use(express.json()); // to parse JSON data

const fhirRoutes = require("./routes/fhir");
const uploadRoutes = require("./routes/upload");
const analyzeRoutes = require("./routes/analyze");
const voiceRoutes = require("./routes/voiceRoutes");
const aiSuggestionsRoutes = require("./routes/aiSuggestions");
const hospitalRoutes = require("./routes/hospitalRoutes");

app.use("/api/fhir", fhirRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api", voiceRoutes);
app.use("/api/ai-suggestions", aiSuggestionsRoutes);
app.use("/api/hospitals", hospitalRoutes);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/healthcare', require('./routes/medicineRoutes'));



// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(process.env.PORT || 5000, () => {
  startCronJobs(); // Start the cron jobs
  console.log("Server started on port 5000");
});
