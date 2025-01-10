import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaUser, FaSignInAlt } from "react-icons/fa";
import Authentication from "./Authentication";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState(""); // "login" or "register"
  const { user, logout, loading } = useAuth();

  const handleMenuToggle = () => setMenuOpen(!menuOpen);
  const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);
  const closeAllMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 text-white shadow-md w-full">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold hover:text-gray-300"
          onClick={closeAllMenus}
        >
          EventPlanner
        </NavLink>

        {/* Hamburger Menu Icon */}
        <div className="text-2xl cursor-pointer lg:hidden" onClick={handleMenuToggle}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Desktop Navigation Links */}
        <ul className={`hidden lg:flex lg:items-center lg:space-x-6`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-gray-300 px-2 py-1 rounded ${
                  isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                }`
              }
              onClick={closeAllMenus}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/event"
              className={({ isActive }) =>
                `hover:text-gray-300 px-2 py-1 rounded ${
                  isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                }`
              }
              onClick={closeAllMenus}
            >
              Search Events
            </NavLink>
          </li>
          <li className="relative">
            <button
              onClick={handleDropdownToggle}
              className="bg-gray-600 hover:text-gray-300 flex items-center focus:outline-none"
            >
              Manage
            </button>
            {dropdownOpen && (
              <ul className="absolute left-0 mt-2 bg-gray-700 text-white rounded shadow-lg py-2">
                <li>
                  <NavLink
                    to="/manage-events"
                    className={({ isActive }) =>
                      `block px-4 py-2 hover:bg-gray-600 ${
                        isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                      }`
                    }
                    onClick={closeAllMenus}
                  >
                    Manage Events
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/create-event"
                    className={({ isActive }) =>
                      `block px-4 py-2 hover:bg-gray-600 ${
                        isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                      }`
                    }
                    onClick={closeAllMenus}
                  >
                    Create Events
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-events"
                    className={({ isActive }) =>
                      `block px-4 py-2 hover:bg-gray-600 ${
                        isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                      }`
                    }
                    onClick={closeAllMenus}
                  >
                    My Events
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `hover:text-gray-300 px-2 py-1 rounded ${
                  isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                }`
              }
              onClick={closeAllMenus}
            >
              Favorites
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `hover:text-gray-300 px-2 py-1 rounded ${
                  isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                }`
              }
              onClick={closeAllMenus}
            >
              Calendar
            </NavLink>
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
                <span>Join us</span>
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
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-4 py-2 hover:text-gray-300 ${
                    isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                  }`
                }
                onClick={closeAllMenus}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/event"
                className={({ isActive }) =>
                  `block px-4 py-2 hover:text-gray-300 ${
                    isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                  }`
                }
                onClick={closeAllMenus}
              >
                Search Events
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleDropdownToggle}
                className="bg-gray-600 block px-4 py-2 hover:text-gray-300"
              >
                Manage
              </button>
              {dropdownOpen && (
                <ul className="space-y-2 pl-4 flex flex-wrap">
                  <li>
                    <NavLink
                      to="/manage-events"
                      className={({ isActive }) =>
                        `block px-4 py-2 hover:bg-gray-600 ${
                          isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                        }`
                      }
                      onClick={closeAllMenus}
                    >
                      Manage Events
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/create-event"
                      className={({ isActive }) =>
                        `block px-4 py-2 hover:bg-gray-600 ${
                          isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                        }`
                      }
                      onClick={closeAllMenus}
                    >
                      Create Events
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/my-events"
                      className={({ isActive }) =>
                        `block px-4 py-2 hover:bg-gray-600 ${
                          isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                        }`
                      }
                      onClick={closeAllMenus}
                    >
                      My Events
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `block px-4 py-2 hover:text-gray-300 ${
                    isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                  }`
                }
                onClick={closeAllMenus}
              >
                Favorites
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `block px-4 py-2 hover:text-gray-300 ${
                    isActive ? "border-b-2 border-blue-500 text-blue-400" : ""
                  }`
                }
                onClick={closeAllMenus}
              >
                Calendar
              </NavLink>
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





