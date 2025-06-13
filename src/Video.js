import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Video.css';

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage, setVideosPerPage] = useState(6);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);  // <-- State for Wix User ID

  // Listen to postMessage from Wix
  useEffect(() => {
    const handleMessage = (event) => {
      // You may optionally check event.origin for security
      if (event.data) {
        setUserId(event.data);
        console.log("Received Wix User ID:", event.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Fetch Videos
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://beyond-sfne.onrender.com/api/BeyondBox/all-activities'
        );
        const activityData = response.data.activities || [];

        const videoData = activityData.map(activity => ({
          url: activity.fileUrl,
          title: `Activity ${activity.activityNo}: ${activity.activityType}`,
          poster:
            activity.fileUrl
              .replace('raw', 'video')
              .replace('.mp4', '.jpg') ||
            `https://via.placeholder.com/320x180.png?text=Video+${activity.activityNo}`,
        }));

        setVideos(videoData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Responsive Video Count
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 768) setVideosPerPage(2);
      else if (width < 992) setVideosPerPage(4);
      else setVideosPerPage(6);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const indexOfLast = currentPage * videosPerPage;
  const indexOfFirst = indexOfLast - videosPerPage;
  const currentVideos = videos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(videos.length / videosPerPage);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading videos...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="video-page">
      <div className="container">
        {/* Show User ID at top */}
        <div className="text-center mb-3">
          {userId ? (
            <h5>Welcome User: {userId}</h5>
          ) : (
            <h5>Loading user information...</h5>
          )}
        </div>

        <h2 className="video-title text-center mb-5">
          🎥 Fun Learning Videos for Kids
        </h2>

        <div className="video-grid">
          {currentVideos.map((video, index) => (
            <div key={index} className="video-card mb-4">
              <video
                controls
                className="video-player"
                poster={video.poster}
              >
                <source src={video.url} type="video/mp4" />
              </video>
              <div className="video-title-label text-center mt-2">
                {video.title}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination pagination-sm">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
