import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './navbar.js';
import Video from './Video.js';
import VideoUpload from './ActivitySubmission.js';

const App = () => {
  return (
    <Router>
      <NavbarAndRoutes />
    </Router>
  );
};

// A separate component to handle Navbar visibility logic
const NavbarAndRoutes = () => {
  const location = useLocation();

  return (
    <>
      {!location.pathname.startsWith('/activity/') && <Navbar />}

      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/videos" replace />} />

        <Route path="/videos/:user_id" element={<Video />} />
        <Route path="/images" element={<h2>Activity Images Page</h2>} />
        <Route path="/comments" element={<h2>Comments Page</h2>} />
        <Route path="/activity/:activityNumber" element={<VideoUpload />} />

        {/* Catch-all route for unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
