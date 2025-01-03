import React from "react";

const RestrictedFeatureModal = ({ onClose, onLogin, onRegister }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center mb-4">
          Restricted Access
        </h2>
        <p className="text-gray-600 text-center mb-6">
          This feature is only available for registered users. Please log in or
          register to continue.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onLogin}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
          <button
            onClick={onRegister}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Register
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default RestrictedFeatureModal;
