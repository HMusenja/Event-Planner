import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Can override with Tailwind if needed
import { useSearchContext } from "../context/SearchContext";
import GoBackButton from "../components/GoBackButton";
import { Link } from "react-router-dom";

function CalendarPage() {
  const { searchResults } = useSearchContext();
  const [eventsByDate, setEventsByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const groupedEvents = searchResults.reduce((acc, event) => {
      const eventDate = new Date(event.dates.start.localDate).toDateString();
      if (!acc[eventDate]) {
        acc[eventDate] = [];
      }
      acc[eventDate].push(event);
      return acc;
    }, {});
    setEventsByDate(groupedEvents);
  }, [searchResults]);

  const handleDateChange = (date) => {
    setSelectedDate(date.toDateString());
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-700 via-purple-800 to-blue-600 text-white px-6 py-8">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute w-96 h-96 bg-blue-500 opacity-30 blur-3xl -top-24 -left-16 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-purple-400 opacity-30 blur-3xl bottom-0 right-0 animate-pulse"></div>
      </div>

      {/* Go Back Button */}
      <div className="mb-8">
        <GoBackButton />
      </div>

      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-wide">
          Event <span className="text-yellow-400">Calendar</span>
        </h1>
        <p className="text-lg mt-4 text-gray-200">Click a date to view events or scroll through all events below.</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-black">
          <h2 className="text-2xl font-semibold mb-6">Calendar</h2>
          <Calendar
            onChange={handleDateChange}
            tileClassName={({ date }) => {
              const dateString = date.toDateString();
              if (eventsByDate[dateString]) {
                return "bg-blue-500 text-white rounded-full"; // Highlight dates with events
              }
              return "";
            }}
            className="w-full"
          />
        </div>

        {/* Events for Selected Date */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-black overflow-y-auto max-h-[75vh]">
          <h2 className="text-2xl font-semibold mb-6">
            {selectedDate ? `Events on ${selectedDate}` : "Select a Date"}
          </h2>
          {selectedDate && eventsByDate[selectedDate]?.length > 0 ? (
            <ul className="space-y-6">
              {eventsByDate[selectedDate].map((event) => (
                <li key={event.id} className="flex items-start space-x-4">
                  {event.images?.[0] && (
                    <img
                      src={event.images[0].url}
                      alt={event.name}
                      className="w-20 h-20 object-cover rounded-md shadow-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{event.name}</h3>
                    <p className="text-sm text-gray-600">Date: {event.dates.start.localDate}</p>
                    <p className="text-sm text-gray-600">Venue: {event._embedded?.venues[0]?.name || "Unknown"}</p>
                    <Link
                      to={`/event/${event.id}`}
                      state={{ event }}
                      className="text-indigo-600 hover:underline text-sm mt-2 block"
                    >
                      View Details
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : selectedDate ? (
            <p className="text-gray-600">No events found for this date.</p>
          ) : (
            <p className="text-gray-600">Select a date to view events.</p>
          )}
        </div>
      </div>

      {/* Display All Events Grouped by Date */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-10 text-black">
        <h2 className="text-2xl font-semibold mb-6">All Events</h2>
        {Object.keys(eventsByDate).length > 0 ? (
          Object.keys(eventsByDate).map((dateString) => (
            <div key={dateString} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{dateString}</h3>
              <ul className="space-y-4">
                {eventsByDate[dateString].map((event) => (
                  <li
                    key={event.id}
                    className="flex items-start space-x-4 border-b pb-4 last:border-none"
                  >
                    {event.images?.[0] && (
                      <img
                        src={event.images[0].url}
                        alt={event.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <h4 className="text-lg font-medium text-gray-800">{event.name}</h4>
                      <p className="text-sm text-gray-600">Date: {event.dates.start.localDate}</p>
                      <p className="text-sm text-gray-600">
                        Venue: {event._embedded?.venues[0]?.name || "Unknown"}
                      </p>
                      <Link
                        to={`/event/${event.id}`}
                        state={{ event }}
                        className="text-blue-500 hover:underline text-sm mt-2 block"
                      >
                        View Details
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No events found.</p>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;


