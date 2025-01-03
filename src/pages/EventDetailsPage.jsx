import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchContext } from "../context/SearchContext";

function EventDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {}; // Get event data passed via location state
  const { favorites, addFavorite, removeFavorite } = useSearchContext();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (event) {
      const isFavorited = favorites.some((e) => e.id === event.id);
      setIsFavorite(isFavorited);
    }
  }, [event, favorites]);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-blue-600 text-white">
        <h2 className="text-3xl font-bold">Event Not Found</h2>
        <button
          onClick={() => navigate("/manage-events")}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Go to Manage Events
        </button>
      </div>
    );
  }

  const venue = event._embedded?.venues?.[0];
  const imageUrl = event.images?.[0]?.url || "https://via.placeholder.com/300";

  const handleAddToFavorites = () => {
    const normalizedEvent = {
      id: event.id,
      name: event.name || "Unnamed Event",
      location: event._embedded?.venues?.[0]?.name || "Location not available",
      date: event.dates?.start?.localDate || "Date not available",
      time: event.dates?.start?.localTime || "Time not available",
      image: event.images?.[0]?.url || "https://via.placeholder.com/150",
      description: event.info || "No description available",
      priceRange: event.priceRanges
        ? `${event.priceRanges[0].min} - ${event.priceRanges[0].max}`
        : "Price not available",
    };

    addFavorite(normalizedEvent);
    setIsFavorite(true);
  };

  const handleRemoveFromFavorites = () => {
    removeFavorite(event);
    setIsFavorite(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-blue-600 text-white px-6 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 text-lg">
        <button
          onClick={() => navigate("/manage-events")}
          className="text-blue-300 hover:underline"
        >
          Manage Events
        </button>
        {" > "}
        <span className="text-gray-300">{event.name}</span>
      </nav>

      {/* Event Details Container */}
      <div className="bg-white rounded-lg shadow-xl p-8 text-black">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          {event.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Event Image & Venue */}
          <div>
            <img
              src={imageUrl}
              alt={event.name}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            {venue && (
              <div className="mt-6">
                <p className="text-gray-700">
                  <strong>Venue:</strong> {venue.name}
                </p>
                <p className="text-gray-700">
                  <strong>City:</strong> {venue.city.name}
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> {venue.address?.line1}
                </p>
              </div>
            )}
          </div>

          {/* Event Details */}
          <div>
            <p className="text-gray-700 mb-4">
              <strong>Date:</strong>{" "}
              {event.dates?.start?.localDate || "Date not available"}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Description:</strong>{" "}
              {event.info || "No description available."}
            </p>
            {event.priceRanges && (
              <p className="text-gray-700 mb-4">
                <strong>Price Range:</strong> ${event.priceRanges[0].min} - $
                {event.priceRanges[0].max}
              </p>
            )}
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-700"
            >
              Buy Tickets
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Back to Events
          </button>
          {event.isOwned && (
            <button
              onClick={() =>
                navigate(`/edit-event/${event.id}`, { state: { event } })
              }
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-700"
            >
              Edit Event
            </button>
          )}
          <button
            onClick={
              isFavorite ? handleRemoveFromFavorites : handleAddToFavorites
            }
            className={`px-4 py-2 rounded-md text-white ${
              isFavorite ? "bg-red-500 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsPage;
