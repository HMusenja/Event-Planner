import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import GoBackButton from "../components/GoBackButton";
import { db } from "../firebase";

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch events from Firestore
  const fetchEvents = async () => {
    setLoading(true);
    setError(""); // Clear any previous errors
    try {
      const eventCollection = collection(db, "events");
      const eventSnapshot = await getDocs(eventCollection);
      const eventList = eventSnapshot.docs.map((doc) => {
        const data = doc.data();
        const ticketsRemaining = (data.ticketQuantity || 0) - (data.ticketsSold || 0);
        return {
          id: doc.id,
          ...data,
          ticketsRemaining,
        };
      });
      setEvents(eventList);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle event deletion with Firestore
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "events", id)); // Delete event from Firestore
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      } catch (err) {
        console.error("Error deleting event:", err);
        setError("Failed to delete the event. Please try again later.");
      }
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto mt-10 px-4 py-6 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 min-h-screen text-white">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute w-80 h-80 bg-indigo-500 opacity-30 blur-2xl -top-20 -left-10 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-pink-400 opacity-30 blur-2xl -bottom-10 -right-10 animate-pulse"></div>
      </div>

      {/* Go Back Button */}
      <div className="mb-6">
        <GoBackButton />
      </div>

      {/* Page Title */}
      <h1 className="text-4xl font-extrabold tracking-wide text-center mb-6">
        Manage <span className="text-accent">Events</span>
      </h1>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded-lg text-center mb-4">
          {error}
        </p>
      )}

      {/* Loading State */}
      {loading ? (
        <p className="text-lg text-center animate-pulse">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-lg text-center mt-10">
          No events available. Create some to see them here!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gradient-to-b from-purple-700 via-indigo-700 to-purple-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 relative"
            >
              {/* Event Image */}
              {event.eventImage && (
                <img
                  src={event.eventImage}
                  alt={event.eventName}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              {/* Event Details */}
              <div>
                <h2 className="text-xl font-bold mb-2">{event.eventName}</h2>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Location:</span> {event.location}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Date:</span> {event.date}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Time:</span> {event.time}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Tickets Remaining:</span>{" "}
                  {event.ticketsRemaining}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Price:</span> $
                  {event.ticketPrice}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                {/* View Details */}
                <button
                  onClick={() =>
                    navigate(`/events/view-details`, { state: { event } })
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
                >
                  View Details
                </button>

                {/* Edit Event */}
                {event.isOwned && (
                  <button
                    onClick={() =>
                      navigate(`/edit-event/${event.id}`, { state: { event } })
                    }
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                )}

                {/* Manage Reservations */}
                <button
                  onClick={() =>
                    navigate(`/manage-reservations`, {
                      state: { eventId: event.id },
                    })
                  }
                  className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
                >
                  Manage Reservations
                </button>

                {/* Delete Event */}
                {event.isOwned && (
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageEvents;



