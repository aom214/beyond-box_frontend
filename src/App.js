import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './navbar.js';
import Video from './Video.js';
import VideoUpload from './ActivitySubmission.js';
import ImageUpload from './ImageUpload.js';
import Images from './Image.js';

const App = () => {
  return (
    <Router>
      <NavbarAndRoutes />
    </Router>
  );
};

const NavbarAndRoutes = () => {
  const location = useLocation();

  return (
    <>
      {!location.pathname.startsWith('/activity/') && <Navbar />}

      <Routes>
          {/* Image Upload */}
          <Route path="/upload-image/:userId/:topic/:activityNo" element={<ImageUpload />} />

          {/* Video Upload */}
          <Route path="/upload-video/:userId/:topic/:activityNo" element={<VideoUpload />} />

          {/* Existing routes */}
          <Route path="/videos/:topic" element={<Video />} />
          <Route path="/images/:topic" element={<Images />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

    </>
  );
};

export default App;
