import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/images/home2.png"; // Make sure your image path is correct

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen overflow-hidden m-0">
      {/* Left Side Image */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 h-screen"
      >
        <img
          src={heroImg}
          alt="Healthcare Hero"
          className="w-full h-full object-fill object-center"
        />
      </motion.div>

      {/* Right Side Content */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 flex flex-col items-center justify-center px-10 bg-white"
      >
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
          Welcome to CareLink
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your AI-powered healthcare companion. Predict disease severity, get
          medicine reminders via calls, and consult our voice assistant for
          quick health checks.
        </p>
        <div className="flex gap-6">
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
