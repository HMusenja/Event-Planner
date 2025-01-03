import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";// Importing Heroicons for "Go Back" icon

const GoBackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  return (
    <button
      onClick={handleGoBack}
      className="flex items-center space-x-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      <ArrowLeftIcon className="h-5 w-5" />
      <span></span>
    </button>
  );
};

export default GoBackButton;
