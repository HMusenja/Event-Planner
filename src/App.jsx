import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom"; // Import useNavigate
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
import ViewDetails from "./components/ViewDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Authentication from "./components/Authentication"; // Import the Authentication modal
import { useAuth } from "./context/AuthContext"; // Import Auth Context
import NotAuthorizedPage from "./components/NotAuthorizedPage"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

const RestrictedModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 className="text-xl font-bold mb-4">Access Restricted</h2>
      <p className="text-gray-700 mb-4">
        Please register or login to access this feature.
      </p>
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

function App() {
  const { user, login, register, logout } = useAuth(); // Use login, register, and logout from AuthContext
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // Show authentication modal
  const navigate = useNavigate();

  const isRegistered = !!user;

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleAddEvent = (event) => {
    setFavoriteEvents((prevEvents) => [...prevEvents, event]);
  };

  const handleRemoveEvent = (eventId) => {
    setFavoriteEvents((prevEvents) =>
      prevEvents.filter((e) => e.id !== eventId)
    );
  };

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) setFavoriteEvents(JSON.parse(savedFavorites));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteEvents));

  }, [favoriteEvents]);



  return (
    <SearchProvider>
      <div className="App">
        <Navbar
          user={user}
          onLogin={() => setShowAuthModal(true)}
          onLogout={logout}
        />
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/event/:eventId" element={<EventDetailsPage />} />
          <Route path="/not-authorized" element={<NotAuthorizedPage />} />
          {/* Protected Routes */}
          <Route
            path="/create-event"
            element={
              <ProtectedRoute
                isAllowed={isRegistered}
                onRestrictedAccess={() => setShowAuthModal(true)}
              >
                <EventCreationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-events"
            element={
              <ProtectedRoute
                isAllowed={isRegistered}
                onRestrictedAccess={() => setShowAuthModal(true)}
              >
                <ManageEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/view-details/:eventId"
            element={
              <ProtectedRoute
                isAllowed={isRegistered}
                onRestrictedAccess={() => setShowAuthModal(true)}
              >
                <ViewDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-event/:id"
            element={
              <ProtectedRoute
                isAllowed={isRegistered}
                onRestrictedAccess={() => setShowAuthModal(true)}
              >
                <EditEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-events"
            element={
              <ProtectedRoute
                isAllowed={isRegistered}
                onRestrictedAccess={() => setShowAuthModal(true)}
              >
                <MyEventsPage
                  favoriteEvents={favoriteEvents}
                  onRemoveEvent={handleRemoveEvent}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute
                isAllowed={isRegistered}
                onRestrictedAccess={() => setShowAuthModal(true)}
              >
                <MyFavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute
                isAllowed={isRegistered}
                onRestrictedAccess={() => setShowAuthModal(true)}
              >
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-reservations"
            element={
              <ProtectedRoute
                isAllowed={isRegistered}
                onRestrictedAccess={() => setShowAuthModal(true)}
              >
                <AttendeesPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Display Restricted Modal */}
        {showRestrictedModal && (
          <RestrictedModal onClose={() => setShowRestrictedModal(false)} />
        )}

        {/* Display Authentication Modal */}
        {showAuthModal && (
          <Authentication onClose={handleAuthModalClose} />
        )}
      </div>
    </SearchProvider>
  );
}

export default App;



