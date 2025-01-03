import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase"; // Ensure you have the Firebase instance set up
import EventCreationForm from "../components/EventCreationForm";

function MyEventsPage() {
  const [myCreatedEvents, setMyCreatedEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [error, setError] = useState("");

  // Fetch events from Firestore
  const fetchEvents = async () => {
    try {
      const eventCollection = collection(db, "events");
      const eventSnapshot = await getDocs(eventCollection);
      const eventList = eventSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyCreatedEvents(eventList);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
    }
  };

  // Add a new event to Firestore
  const handleCreateEvent = async (newEvent) => {
    try {
      const eventCollection = collection(db, "events");
      const docRef = await addDoc(eventCollection, newEvent);
      setMyCreatedEvents((prev) => [...prev, { id: docRef.id, ...newEvent }]);
    } catch (err) {
      console.error("Error creating event:", err);
      setError("Failed to create the event. Please try again later.");
    }
  };

  // Delete an event from Firestore
  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      setMyCreatedEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete the event. Please try again later.");
    }
  };

  // Edit an event in Firestore
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEditFormData(event);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateDoc(doc(db, "events", editingEvent.id), editFormData);
      setMyCreatedEvents((prev) =>
        prev.map((event) => (event.id === editingEvent.id ? { ...editFormData } : event))
      );
      setIsEditModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Failed to update the event. Please try again later.");
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto mt-10 px-4 py-6 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 min-h-screen text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute w-96 h-96 bg-indigo-400 opacity-30 blur-3xl -top-10 -left-10 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-pink-500 opacity-30 blur-2xl -bottom-10 -right-20 animate-pulse"></div>
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold tracking-wide">
          My <span className="text-accent">Events</span>
        </h1>
        <button
          onClick={() => setShowCreateEventForm((prev) => !prev)}
          className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-transform transform hover:scale-105"
        >
          {showCreateEventForm ? "Cancel" : "Create Event"}
        </button>
      </div>

      {/* Event Creation Form */}
      {showCreateEventForm && <EventCreationForm onEventCreated={handleCreateEvent} />}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded-lg text-center mb-4">
          {error}
        </p>
      )}

      {/* Created Events Section */}
      <h2 className="text-3xl font-semibold mb-4">Created Events</h2>
      {myCreatedEvents.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCreatedEvents.map((event) => (
            <li
              key={event.id}
              className="bg-gradient-to-b from-purple-600 via-indigo-600 to-purple-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            >
              {event.eventImage && (
                <img
                  src={event.eventImage}
                  alt={event.eventName}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-accent mb-2">{event.eventName}</h3>
              <p className="text-light mb-1">
                <span className="font-semibold">Location:</span> {event.location}
              </p>
              <p className="text-light mb-1">
                <span className="font-semibold">Date:</span> {event.date}
              </p>
              <p className="text-light mb-2">
                <span className="font-semibold">Time:</span> {event.time}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEditEvent(event)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:opacity-90"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg text-center mt-10">No events created yet!</p>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Event</h2>
            <form>
              <input
                type="text"
                name="eventName"
                value={editFormData.eventName}
                onChange={handleEditInputChange}
                placeholder="Event Name"
                className="w-full px-4 py-2 border rounded-lg mb-4"
              />
              <button
                type="button"
                onClick={handleSaveEdit}
                className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyEventsPage;

