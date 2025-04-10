import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import firstImg from "../assets/images/first.png";
import secondImg from "../assets/images/second.png";
import thirdImg from "../assets/images/third.png";
import logo from "../assets/images/image.png";

export default function MainPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen ">
      {/* Logo and Title */}
      <div className="flex justify-center gap-4  mt-5 ">
        <img
          src={logo}
          alt="CareLink Logo"
          className="w-16 h-16 rounded-full shadow-md"
        />
        <div className="items-center mt-2">
          <h1 className="text-5xl font-bold  text-green-600">CareLink</h1>
        </div>
      </div>
      {/* <nav className="bg-blue-600 py-4">
        <h1 className="text-2xl font-bold text-center text-white">
          HealthCare
        </h1>
      </nav> */}

      <motion.div
        className="max-w-6xl mx-auto py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.h2
            className="text-3xl font-bold text-blue-700 hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Your Smart Health Companion
          </motion.h2>
          <motion.p
            className="text-gray-600 mt-2 hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            AI-powered healthcare solutions at your fingertips
          </motion.p>
        </motion.div>

        {/* Feature 1 - Left Image */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-6 bg-white shadow-md rounded-lg px-10 py-6 mb-10"
          variants={itemVariants}
        >
          <motion.img
            src={firstImg}
            alt="Medicine reminder"
            className="w-80 h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          />
          <motion.div
            className="text-center md:text-left"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold mb-2">
              Never Forget Your Medication
            </h3>
            <p className="text-gray-600 mb-4">
              Get automated phone call reminders for your medicines at the
              perfect time.
            </p>
            <motion.button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              onClick={() => navigate("/medicines")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Medicine Reminder
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Feature 2 - Right Image */}
        <motion.div
          className="flex flex-col md:flex-row-reverse items-center gap-6 bg-white shadow-md rounded-lg px-10 py-6 mb-10"
          variants={itemVariants}
        >
          <motion.img
            src={secondImg}
            alt="Disease prediction"
            className="w-80 h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          />
          <motion.div
            className="text-center md:text-left"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold mb-2">
              Understand Your Health Risks
            </h3>
            <p className="text-gray-600 mb-4">
              Upload medical reports to get AI-powered analysis of disease
              severity.
            </p>
            <motion.button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
              onClick={() => navigate("/disease-prediction")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Disease Prediction
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Feature 3 - Left Image */}
        <motion.div
          className="flex flex-col md:flex-row items-center gap-6 bg-white shadow-md rounded-lg px-10 py-6"
          variants={itemVariants}
        >
          <motion.img
            src={thirdImg}
            alt="Voice assistant"
            className="w-80 h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          />
          <motion.div
            className="text-center md:text-left"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold mb-2">
              Voice-Enabled Health Assistant
            </h3>
            <p className="text-gray-600 mb-4">
              Describe your symptoms naturally and get instant health guidance.
            </p>
            <motion.button
              className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition duration-300"
              onClick={() => navigate("/voice-assistant")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Voice Assistant
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}