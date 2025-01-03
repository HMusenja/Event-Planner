import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const ConditionalNavbar = ({ user, onLogin, onLogout }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/not-authorized"];

  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  return <Navbar user={user} onLogin={onLogin} onLogout={onLogout} />;
};

export default ConditionalNavbar;
