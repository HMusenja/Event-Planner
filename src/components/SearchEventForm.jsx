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
    
    // Clear error when user starts typing
    if (error) setError("");
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
    <div className="container mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Find an Event!</h2>

      {/* Form layout in a row */}
      <form onSubmit={handleSubmit} className="flex space-x-4 mb-6">
        <div className="flex-1">
          <label className="block text-gray-300">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border text-gray-800 rounded"
            placeholder="e.g., Music, Sports"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-300">Town</label>
          <input
            type="text"
            name="town"
            value={formData.town}
            onChange={handleInputChange}
            className="w-full p-2 border text-gray-800 rounded"
            placeholder="e.g., New York, Los Angeles"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 self-center"
        >
          Search
        </button>
      </form>

      {/* Display loading/error messages */}
      {loading && <p className="mt-4 text-blue-600">Loading events...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {/* Display the total number of events found */}
      {searchResults.length > 0 && !loading && (
        <p className="text-lg font-medium mb-4">
          {searchResults.length} event{searchResults.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* No results found message */}
      {searchResults.length === 0 && !loading && !error && (
        <p className="mt-4 text-gray-600">No events found. Please try a different search.</p>
      )}

      {/* Display search results */}
      <div className="mt-6">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.slice(0, visibleCount).map((event, index) => {
            const eventImage = event.images?.[0]?.url || "placeholder.jpg"; // Use the first image or a fallback
            const uniqueKey = `${event.id}-${index}`;
            return (
              <li key={uniqueKey} className="border p-4 rounded bg-gray-800">
                <h4 className="font-bold">{event.name}</h4>
                <img
                  src={eventImage}
                  alt={event.name}
                  className="w-full h-64 object-cover rounded mt-2"
                />
                <p>Date: {event.dates.start.localDate}</p>
                <p>Venue: {event._embedded?.venues[0]?.name || "Unknown"}</p>
                <p>City: {event._embedded?.venues[0]?.city?.name || "Unknown"}</p>
                <Link
                  to={`/event/${event.id}`}
                  state={{ event }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2 inline-block"
                >
                  View Details
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Button to load more results */}
        {visibleCount < searchResults.length && (
          <button
            onClick={handleLoadMore}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchEventForm;
