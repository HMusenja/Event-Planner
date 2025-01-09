import React, { useState } from "react";
import { useSearchContext } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext"; // Import Auth context
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc, deleteDoc } from "firebase/firestore";

function MyFavoritesPage() {
  const { favorites, removeFavorite, handleSearch, searchTerm } = useSearchContext();
  const { user } = useAuth(); // Get the current user
  const db = getFirestore(); // Initialize Firestore
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [eventToRemove, setEventToRemove] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const navigate = useNavigate();

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = favorites.slice(indexOfFirstEvent, indexOfLastEvent);

  const confirmRemove = (event) => {
    setEventToRemove(event);
    setShowConfirmation(true);
  };

  const handleRemove = async () => {
    if (eventToRemove) {
      try {
        // Remove from Firestore
        const favoriteRef = doc(db, `users/${user.uid}/favorites`, eventToRemove.id);
        await deleteDoc(favoriteRef);

        // Remove locally
        removeFavorite(eventToRemove.id);
        setShowConfirmation(false);
        setEventToRemove(null);
      } catch (error) {
        console.error("Error removing favorite from Firestore:", error);
      }
    }
  };

  const handleAddToFavorites = async (event) => {
    try {
      // Save to Firestore
      const favoriteRef = doc(db, `users/${user.uid}/favorites`, event.id);
      await setDoc(favoriteRef, event);

      console.log("Event added to favorites in Firestore!");
    } catch (error) {
      console.error("Error saving favorite to Firestore:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(favorites.length / eventsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto mt-10 px-6 py-8 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 min-h-screen text-white">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute w-96 h-96 bg-indigo-500 opacity-30 blur-3xl -top-32 -left-20 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-purple-400 opacity-30 blur-3xl -bottom-16 -right-16 animate-pulse"></div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold tracking-wide text-center mb-8">
        My <span className="text-yellow-400">Favorite</span> Events
      </h1>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-4 text-black rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* Event List */}
      {currentEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform"
            >
              <img
                src={event.image || "https://via.placeholder.com/150"}
                alt={event.name || "Unnamed Event"}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-2xl font-bold mb-2 text-yellow-400">{event.name || "Unnamed Event"}</h3>
                <p className="mb-1">
                  <span className="font-semibold">Location:</span> {event.location || "N/A"}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Date:</span> {event.date || "N/A"}
                </p>
                <p className="mb-3">
                  <span className="font-semibold">Time:</span> {event.time || "N/A"}
                </p>
                <button
                  onClick={() => confirmRemove(event)}
                  className="w-full py-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
                >
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-200 text-lg mt-16">
          No favorite events yet. Add some from the events list!
        </p>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-12">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-lg">
          Page {currentPage} of {Math.ceil(favorites.length / eventsPerPage)}
        </p>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(favorites.length / eventsPerPage)}
          className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Go Back */}
      <div className="mt-8 text-center">
        <button
          onClick={handleGoBack}
          className="px-6 py-3 bg-yellow-500 rounded-lg text-black font-bold hover:bg-yellow-600"
        >
          Go Back
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-black">
            <h2 className="text-2xl font-bold mb-4">Confirm Removal</h2>
            <p className="mb-4">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-indigo-600">{eventToRemove?.name}</span>?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleRemove}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-2 bg-gray-400 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyFavoritesPage;

