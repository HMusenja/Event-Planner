
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Include Tailwind CSS
import { AuthProvider } from './context/AuthContext';

import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router> {/* Wrap App in Router */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

