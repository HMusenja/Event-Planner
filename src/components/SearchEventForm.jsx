import React, { useState } from "react";
import { useSearchContext } from "../context/SearchContext";
import { Link } from "react-router-dom";

function SearchEventForm() {
  const { searchResults, setSearchData } = useSearchContext();
  const [formData, setFormData] = useState({
    category: "",
    town: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (error) setError(""); // Clear error when typing
  };

  const fetchEvents = async () => {
    const API_KEY = "mOFr2N2LO0CuZBIXgKd9m8lJBRf1IFy7";
    const { category, town } = formData;

    if (!API_KEY) {
      setError("API key is missing. Please configure your environment.");
      return;
    }

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${encodeURIComponent(
      category
    )}&city=${encodeURIComponent(town)}`;

    try {
      setLoading(true);
      setError("");
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      const fetchedEvents = data._embedded?.events || [];

      setSearchData(fetchedEvents);
      setVisibleCount(8);
    } catch (err) {
      setError("Unable to fetch events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category.trim() || !formData.town.trim()) {
      setError("Both category and town fields are required.");
      return;
    }
    fetchEvents();
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">
        Find an Event!
      </h2>

      {/* Form Layout */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 md:flex-row md:gap-6 items-center justify-center"
      >
        <div className="flex-1 w-full">
          <label className="block text-gray-300 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-500 rounded bg-gray-800 text-white focus:ring-2 focus:ring-accent"
            placeholder="e.g., Music, Sports"
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-gray-300 mb-1">Town</label>
          <input
            type="text"
            name="town"
            value={formData.town}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-500 rounded bg-gray-800 text-white focus:ring-2 focus:ring-accent"
            placeholder="e.g., New York, Los Angeles"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Loading/Error Messages */}
      {loading && <p className="mt-4 text-blue-600 text-center">Loading events...</p>}
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

      {/* Results */}
      {searchResults.length > 0 && !loading && (
        <p className="text-lg font-medium mb-4 mt-4 text-center text-gray-200">
          {searchResults.length} event{searchResults.length !== 1 ? "s" : ""} found
        </p>
      )}

      {searchResults.length === 0 && !loading && !error && (
        <p className="mt-4 text-gray-400 text-center">
          No events found. Please try a different search.
        </p>
      )}

      {/* Display Search Results */}
      <div className="mt-6">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {searchResults.slice(0, visibleCount).map((event, index) => {
            const eventImage = event.images?.[0]?.url || "placeholder.jpg";
            const uniqueKey = `${event.id}-${index}`;
            return (
              <li
                key={uniqueKey}
                className="border border-gray-700 p-4 rounded-lg bg-gray-800 text-white shadow-lg transition-transform hover:scale-105"
              >
                <h4 className="font-bold text-lg mb-2">{event.name}</h4>
                <img
                  src={eventImage}
                  alt={event.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {event.dates.start.localDate}
                </p>
                <p>
                  <span className="font-semibold">Venue:</span>{" "}
                  {event._embedded?.venues[0]?.name || "Unknown"}
                </p>
                <p>
                  <span className="font-semibold">City:</span>{" "}
                  {event._embedded?.venues[0]?.city?.name || "Unknown"}
                </p>
                <Link
                  to={`/event/${event.id}`}
                  state={{ event }}
                  className="block mt-4 px-4 py-2 bg-blue-600 text-center text-white rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Load More Button */}
        {visibleCount < searchResults.length && (
          <div className="text-center mt-6">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchEventForm;

