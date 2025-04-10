const cron = require("node-cron");
const mongoose = require("mongoose");
const Medicine = require("../models/Medicine.js");
const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();
const sendMedicineEmail = require("../utils/emailService"); // Adjust path as needed

const client = twilio(
  "ACfa3d3f0bf30d39fa66a03055fa3a36dd",
  "f6169f5a15b7fc55686d91d04780a5ca"
);

// Connect to DB
mongoose
  .connect(
    "mongodb+srv://manikanthdaru82:3EPtBJ37LMPpDEaT@cluster0.trohaiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Every minute
function startCronJobs() {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const currentDate = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
      console.log(currentDate);
      const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"
      console.log(currentTime);
      let currentDay = now.toLocaleString("en-US", { weekday: "long" });
      currentDay = currentDay.slice(0, 3);
      console.log(currentDay);

      const medicines = await Medicine.find({
        startDate: currentDate,
        startTime: currentTime,
        days: { $in: [currentDay] },
      });
      console.log(medicines);
      for (const med of medicines) {
        const message = `Hello, this is a reminder to take your ${med.medicineName} ${med.dosageMg} milligrams.`;
        const phoneNumber = med.phoneNumber || "+919346489605";
        const reqPhone = +16363031083;

        await client.calls.create({
          twiml: `<Response><Say>${message}</Say></Response>`,
          to: phoneNumber,
          from: reqPhone,
        });

        console.log(`📞 Call made to ${phoneNumber} for ${med.medicineName}`);

        await sendMedicineEmail(
          med.email,
          "💊 Medicine Reminder",
          `<h3>Hello!</h3>
     <p>This is a reminder to inform your mother has to take the medicine:</p>
     <ul>
       <li><strong>${med.medicineName}</strong></li>
       <li>Dosage: ${med.dosageMg} mg</li>
       <li>Time: ${med.startTime}</li>
     </ul>
     <p>Stay healthy! 🩺</p>`
        );
      }
    } catch (err) {
      console.error("❌ Cron job failed:", err.message);
    }
  });
}

module.exports = startCronJobs;