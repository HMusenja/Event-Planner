import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assuming you have the `useAuth` hook
import { FaBars, FaTimes, FaUser, FaSignInAlt } from "react-icons/fa";
import Authentication from "./Authentication";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState(""); // "login" or "register"
  const { user, logout, loading } = useAuth(); // Added `loading` state from useAuth

  // Toggle hamburger menu
  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  // Toggle dropdown menu
  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);

  // Close both menu and dropdown
  const closeAllMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  // Open authentication modal
  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // Close authentication modal
  const closeAuthModal = () => setAuthModalOpen(false);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 text-white shadow-md w-full">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold hover:text-gray-300"
          onClick={closeAllMenus}
        >
          EventPlanner
        </Link>

        {/* Hamburger Menu Icon */}
        <div className="text-2xl cursor-pointer lg:hidden" onClick={handleMenuToggle}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Desktop Navigation Links */}
        <ul className={`hidden lg:flex lg:items-center lg:space-x-6`}>
          <li>
            <Link to="/" className="hover:text-gray-300" onClick={closeAllMenus}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/event" className="hover:text-gray-300" onClick={closeAllMenus}>
              Search Events
            </Link>
          </li>
          <li className="relative">
            <button
              onClick={handleDropdownToggle}
              className=" bg-gray-600 hover:text-gray-300 flex items-center focus:outline-none"
            >
              Manage
            </button>
            {dropdownOpen && (
              <ul className="absolute left-0 mt-2 bg-gray-700 text-white rounded shadow-lg py-2">
                <li>
                  <Link
                    to="/manage-events"
                    className="block px-4 py-2 hover:bg-gray-600"
                    onClick={closeAllMenus}
                  >
                    Manage Events
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-event"
                    className="block px-4 py-2 hover:bg-gray-600"
                    onClick={closeAllMenus}
                  >
                    Create Events
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-events"
                    className="block px-4 py-2 hover:bg-gray-600"
                    onClick={closeAllMenus}
                  >
                    My Events
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/favorites" className="hover:text-gray-300" onClick={closeAllMenus}>
              Favorites
            </Link>
          </li>
          <li>
            <Link to="/calendar" className="hover:text-gray-300" onClick={closeAllMenus}>
              Calendar
            </Link>
          </li>
        </ul>

        {/* User Section */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, {user.username || "Guest"}!</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openAuthModal("login")}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                <FaSignInAlt />
                <span>Login</span>
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FaUser />
                <span>Register</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Links */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-700 py-4 space-y-4 text-sm">
          <ul className="flex flex-wrap space-y-2">
            <li>
              <Link to="/" className="block px-4 py-2 hover:text-gray-300" onClick={closeAllMenus}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/event" className="block px-4 py-2 hover:text-gray-300" onClick={closeAllMenus}>
                Search
              </Link>
            </li>
            <li>
              <button
                onClick={handleDropdownToggle}
                className="bg-gray-600 block px-4 py-2 hover:text-gray-300"
              >
                Manage
              </button>
              {dropdownOpen && (
                <ul className=" flex flex-wrappl-4 space-y-2">
                  <li>
                    <Link
                      to="/manage-events"
                      className="block px-4 py-2 hover:bg-gray-600"
                      onClick={closeAllMenus}
                    >
                      Manage Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/create-event"
                      className="block px-4 py-2 hover:bg-gray-600"
                      onClick={closeAllMenus}
                    >
                      Create Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-events"
                      className="block px-4 py-2 hover:bg-gray-600"
                      onClick={closeAllMenus}
                    >
                      My Events
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/favorites" className="block px-4 py-2 hover:text-gray-300" onClick={closeAllMenus}>
                Favorites
              </Link>
            </li>
            <li>
              <Link to="/calendar" className="block px-4 py-2 hover:text-gray-300" onClick={closeAllMenus}>
                Calendar
              </Link>
            </li>
          </ul>

          {/* Login and Register buttons in mobile */}
          {!user && (
            <div className="flex space-x-4 px-4">
              <button
                onClick={() => openAuthModal("login")}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                <FaSignInAlt />
                <span>Login</span>
              </button>
              <button
                onClick={() => openAuthModal("register")}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FaUser />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Authentication Modal */}
      {authModalOpen && <Authentication mode={authMode} onClose={closeAuthModal} />}
    </nav>
  );
}

export default Navbar;



