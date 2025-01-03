import React from "react";
import { useNavigate } from "react-router-dom";

const NotAuthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Access Restricted</h2>
        <p className="text-gray-700 mb-4">
          You need to log in or register to access this feature.
        </p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            onClick={() => navigate("/login")}
          >
            Login/Register
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={() => navigate("/")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorizedPage;

