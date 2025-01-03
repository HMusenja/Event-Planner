import React, { useState, useEffect } from "react";
import { useSearchContext } from "../context/SearchContext";
import { Link } from "react-router-dom";
import SearchEventForm from "../components/SearchEventForm";

function EventPage() {
  const { searchResults } = useSearchContext();
  const [eventsByDate, setEventsByDate] = useState({});
  const [eventSuggestions, setEventSuggestions] = useState([]);
  const [visibleSuggestions, setVisibleSuggestions] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const groupedEvents = searchResults.reduce((acc, event) => {
      const eventDate = new Date(event.dates.start.localDate).toDateString();
      if (!acc[eventDate]) acc[eventDate] = [];
      acc[eventDate].push(event);
      return acc;
    }, {});
    setEventsByDate(groupedEvents);
  }, [searchResults]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const lastSearch = localStorage.getItem("lastSearch");
      if (!lastSearch) return;

      const { category, town } = JSON.parse(lastSearch);
      const API_KEY = "mOFr2N2LO0CuZBIXgKd9m8lJBRf1IFy7";

      try {
        const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${encodeURIComponent(
          category
        )}&city=${encodeURIComponent(town)}`;
        const response = await fetch(url);
        const data = await response.json();
        const suggestions = data._embedded?.events || [];
        setEventSuggestions(suggestions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch event suggestions:", err);
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="eventcontainer">
      <div className="container mx-auto mt-10 px-4 py-6 bg-primary text-white min-h-screen relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 z-[-1]">
          <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-500 h-full w-full opacity-40"></div>
          <div className="absolute w-96 h-96 bg-accent opacity-30 blur-3xl -top-20 -left-10 animate-pulse"></div>
          <div className="absolute w-72 h-72 bg-secondary opacity-30 blur-2xl -bottom-10 -right-20 animate-pulse"></div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 py-10 rounded-lg shadow-lg mb-8">
          <h1 className="text-4xl font-extrabold text-center text-white tracking-wide animate-fadeIn">
            Find Your Next <span className="text-accent">Event</span>
          </h1>
          <p className="text-center mt-2 text-lg text-light">
            Browse, search, and plan your perfect day out.
          </p>
        </div>

        {/* Search Form */}
        <SearchEventForm />

        {/* Events Layout */}
        {loading ? (
          <div className="mt-8 text-center">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-solid border-accent border-t-transparent rounded-full"></div>
            <p className="mt-4 text-light">Loading event suggestions...</p>
          </div>
        ) : (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-accent mb-6">
              Event Suggestions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventSuggestions.slice(0, visibleSuggestions).map((event) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-b from-secondary via-primary to-secondary p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                >
                  {event.images?.[0] && (
                    <img
                      src={event.images[0].url}
                      alt={event.name}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}
                  <h4 className="text-xl font-bold text-accent mb-2">
                    {event.name}
                  </h4>
                  <p className="text-light mb-1">
                    <span className="font-semibold">Venue:</span>{" "}
                    {event._embedded?.venues[0]?.name || "Unknown Venue"}
                  </p>
                  <p className="text-light mb-2">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(event.dates.start.localDate).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/event/${event.id}`}
                    state={{ event }}
                    className="block mt-2 text-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-80"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
            {visibleSuggestions < eventSuggestions.length && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleSuggestions((prev) => prev + 4)}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded hover:opacity-90 shadow-md"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventPage;
