import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './navbar';
import Video from './Video';
import VideoUpload from './ActivitySubmission';
import ImageUpload from './ImageUpload';
import Images from './Image';  // Assuming you have Comments page

const App = () => {
  return (
    <Router>
      <NavbarAndRoutes />
    </Router>
  );
};

const NavbarAndRoutes = () => {
  const location = useLocation();

  const hideNavbar = location.pathname.startsWith('/upload-image/') || location.pathname.startsWith('/upload-video/');

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Image Upload */}
        <Route path="/upload-image/:userId/:topic/:activityNo" element={<ImageUpload />} />

        {/* Video Upload */}
        <Route path="/upload-video/:userId/:topic/:activityNo" element={<VideoUpload />} />

        {/* All Topic Routes */}
        <Route path="/videos/:topic" element={<Video />} />
        <Route path="/images/:topic" element={<Images />} />


        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/videos/archimedes" replace />} />
      </Routes>
    </>
  );
};

export default App;
