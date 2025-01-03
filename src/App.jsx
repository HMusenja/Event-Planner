import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import EventPage from "./pages/EventPage";
import ManageEvents from "./pages/ManageEvents";
import EventDetailsPage from "./pages/EventDetailsPage";
import EventCreationForm from "./components/EventCreationForm";
import EditEventPage from "./pages/EditEventPage";
import MyEventsPage from "./pages/MyEventsPage";
import MyFavoritesPage from "./pages/MyFavoritesPage";
import { SearchProvider } from "./context/SearchContext";
import CalendarPage from "./pages/CalendarPage";
import AttendeesPage from "./pages/AttendeesPage";
import ViewDetails from "./components/ViewDetails"; // Import the new component

import { ToastContainer, toast } from "react-toastify";

import "./App.css";

function App() {
  const [user, setUser] = useState(null); // User state for login/logout
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  // Function to handle user login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data to localStorage
    toast.success("Logged in successfully!");
  };

  // Function to handle user logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user data from localStorage
    toast.success("Logged out successfully!");
  };

  // Function to handle adding events to favorites
  const handleAddEvent = (event) => {
    setFavoriteEvents((prevEvents) => [...prevEvents, event]);
  };

  // Function to handle removing events from favorites
  const handleRemoveEvent = (eventId) => {
    setFavoriteEvents((prevEvents) =>
      prevEvents.filter((e) => e.id !== eventId)
    );
  };

  useEffect(() => {
    // Load user data and favorite events from localStorage
    const savedUser = localStorage.getItem("user");
    const savedFavorites = localStorage.getItem("favorites");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedFavorites) setFavoriteEvents(JSON.parse(savedFavorites));
  }, []);

  useEffect(() => {
    // Save favorite events to localStorage
    localStorage.setItem("favorites", JSON.stringify(favoriteEvents));
  }, [favoriteEvents]);

  return (
    <SearchProvider>
      <Router>
        <div className="App">
          {/* Pass user, login, and logout functions to Navbar */}
          <Navbar
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
          <ToastContainer />
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<HomePage />} />

            {/* Event Pages */}
            <Route path="/event" element={<EventPage />} />

            {/* Event Details Page */}
            <Route
              path="/event/:eventId"
              element={<EventDetailsPage onAddEvent={handleAddEvent} />}
            />

            {/* Event Creation Form */}
            <Route path="/create-event" element={<EventCreationForm />} />

            {/* Manage Events Page */}
            <Route path="/manage-events" element={<ManageEvents />} />
            <Route path="/events/view-details" element={<ViewDetails />} />
            {/* Edit Event Page */}
            <Route path="/edit-event/:id" element={<EditEventPage />} />

            {/* My Events (Favorites) Page */}
            <Route
              path="/my-events"
              element={
                <MyEventsPage
                  favoriteEvents={favoriteEvents}
                  onRemoveEvent={handleRemoveEvent}
                />
              }
            />
            <Route path="/favorites" element={<MyFavoritesPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/manage-reservations" element={<AttendeesPage />} />
          </Routes>
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;
