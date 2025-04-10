const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  medicineName: String,
  medicineType: String,
  dosageMg: Number,
  startDate: { type: String, required: true }, // e.g. "09-04-2025"
  startTime: { type: String, required: true }, // e.g. "16:34"
  intervalHours: String,
  email: {
    type: String,
    required: true,
    default: "pothugantikalyankumar71@gmail.com",
  },
  days: [String],
});

module.exports = mongoose.model("Medicine", medicineSchema);
