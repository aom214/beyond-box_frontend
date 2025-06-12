import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './navbar.js';
import Video from './Video.js';
import VideoUpload from './ActivitySubmission.js';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NavbarAndRoutes />} />
      </Routes>
    </Router>
  );
};

// A separate component to handle Navbar visibility logic
const NavbarAndRoutes = () => {
  const location = useLocation(); // useLocation within the Router context

  return (
    <>
      {/* Conditionally render Navbar, hide it on activity pages */}
      {!location.pathname.startsWith('/activity/') && <Navbar />}

      <Routes>
        {/* Redirect to /videos by default */}
        <Route path="/" element={<Navigate to="/videos" />} />

        {/* Route for displaying video list */}
        <Route path="/videos" element={<Video />} />

        {/* Placeholder for images page */}
        <Route path="/images" element={<h2>Activity Images Page</h2>} />

        {/* Placeholder for comments page */}
        <Route path="/comments" element={<h2>Comments Page</h2>} />

        {/* Dynamic route for activity video upload, passing activity number */}
        <Route path="/activity/:activityNumber" element={<VideoUpload />} />
      </Routes>
    </>
  );
};

export default App;
