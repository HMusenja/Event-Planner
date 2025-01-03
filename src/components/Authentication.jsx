import React, { useState } from "react";
import { FaUser, FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Authentication = ({ onClose }) => {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLoginMode) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.username);
      }
      onClose(); // Close modal after success
    } catch (err) {
      console.error(isLoginMode ? "Login error:" : "Registration error:", err);
      alert(isLoginMode ? "Invalid login credentials" : "Registration failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLoginMode ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div className="flex items-center border rounded px-3 py-2">
              <FaUser className="mr-2 text-gray-500" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              className="text-gray-600 w-full focus:outline-none"
                required={!isLoginMode}
              />
            </div>
          )}
          <div className="flex items-center border rounded px-3 py-2">
            <FaEnvelope className="mr-2 text-gray-800" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="text-gray-600 w-full focus:outline-none"
              required
            />
          </div>
          <div className="flex items-center border rounded px-3 py-2">
            <FaLock className="mr-2 text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="text-gray-600 w-full focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isLoginMode ? "Login" : "Register"}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Authentication;

