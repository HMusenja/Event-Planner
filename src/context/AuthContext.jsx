import React, { createContext, useContext, useState } from "react";

// Create Auth Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // `null` for guests, object for logged-in users

  // Log in as a specific role
  const login = (role) => {
    const newUser = { name: role === "registered" ? "Registered User" : "Guest", role };
    setUser(newUser);
  };

  // Log out function
  const logout = () => {
    setUser(null); // Reset to guest
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
