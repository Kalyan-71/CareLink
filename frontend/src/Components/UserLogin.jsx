import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";


export default function UserLogin() {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      phoneNumber: number,
      password: password,
    };

    const res =axios
    .post("https://carelink-backend-njjn.onrender.com/api/auth/login", userData)
    .then((response) => {
      console.log(response.data);
      // alert("Login successful!");
      toast.success("Login successful!");
      console.log(response);
      localStorage.setItem("userId", response.data.userId);
      navigate("/mainpage");
    })
    .catch((error) => {
      // console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    });
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500">
            Log in to manage your medications
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 cursor-pointer text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500 text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}
