import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate
import { collection, addDoc, Timestamp } from "firebase/firestore"; // Import collection and addDoc
import { ref, uploadString, getDownloadURL } from "firebase/storage"; // For image storage
import { db, storage } from "../firebase"; // Import db and storage
import { getAuth } from "firebase/auth";
import "../styles/EventCreationForm.css";

function EventCreationForm() {
  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    date: "",
    time: "",
    ticketQuantity: "",
    ticketPrice: "",
    eventImage: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input for event image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFormData({ ...formData, eventImage: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.eventName) newErrors.eventName = "Event name is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.time) newErrors.time = "Time is required.";
    if (!formData.ticketQuantity || isNaN(formData.ticketQuantity) || formData.ticketQuantity <= 0)
      newErrors.ticketQuantity = "Ticket quantity must be a positive number.";
    if (!formData.ticketPrice || isNaN(formData.ticketPrice) || formData.ticketPrice <= 0)
      newErrors.ticketPrice = "Ticket price must be a positive number.";
    return newErrors;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      // Check if the user is logged in
      const user = auth.currentUser;
      if (!user || !user.uid) {
        throw new Error("User is not logged in.");
      }

      // Upload image to Firebase Storage (if provided)
      let eventImageUrl = "";
      if (formData.eventImage) {
        const storageRef = ref(storage, `event-images/${Date.now()}`);
        await uploadString(storageRef, formData.eventImage, "data_url");
        eventImageUrl = await getDownloadURL(storageRef);
      }

      // Save event data under the logged-in user's collection
      const userEventsCollection = collection(db, `users/${user.uid}/events`);
      await addDoc(userEventsCollection, {
        eventName: formData.eventName,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        ticketQuantity: parseInt(formData.ticketQuantity),
        ticketPrice: parseFloat(formData.ticketPrice),
        eventImage: eventImageUrl,
        createdAt: Timestamp.now(), // Timestamp for the event creation
      });

      // Show success message
      setSuccessMessage("Event created successfully!");

      // Reset form
      setFormData({
        eventName: "",
        location: "",
        date: "",
        time: "",
        ticketQuantity: "",
        ticketPrice: "",
        eventImage: "",
      });

      // Redirect to manage events page after 2 seconds
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/manage-events");
      }, 2000);
    } catch (error) {
      console.error("Error creating event:", error);
      setErrors({
        general:
          "An error occurred while creating the event. Please ensure you are logged in and try again.",
      });
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4 sm:px-6 md:px-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-semibold mb-6 text-center">Create New Event</h1>
      {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}
      {errors.general && <p className="text-red-500 mb-4 text-center">{errors.general}</p>}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div>
          <label className="block text-gray-300">Event Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 mt-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
          {formData.eventImage && (
            <img
              src={formData.eventImage}
              alt="Event Preview"
              className="w-32 h-32 object-cover mt-4 rounded border-2 border-gray-600"
            />
          )}
        </div>
        <div>
          <label className="block text-gray-300">Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
          {errors.eventName && <p className="text-red-500">{errors.eventName}</p>}
        </div>
        <div>
          <label className="block text-gray-300">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
          {errors.location && <p className="text-red-500">{errors.location}</p>}
        </div>
        <div>
          <label className="block text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
          {errors.date && <p className="text-red-500">{errors.date}</p>}
        </div>
        <div>
          <label className="block text-gray-300">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
          {errors.time && <p className="text-red-500">{errors.time}</p>}
        </div>
        <div>
          <label className="block text-gray-300">Ticket Quantity</label>
          <input
            type="number"
            name="ticketQuantity"
            value={formData.ticketQuantity}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
          {errors.ticketQuantity && <p className="text-red-500">{errors.ticketQuantity}</p>}
        </div>
        <div>
          <label className="block text-gray-300">Ticket Price</label>
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleInputChange}
            className="w-full p-3 mt-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
          {errors.ticketPrice && <p className="text-red-500">{errors.ticketPrice}</p>}
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}

export default EventCreationForm;



