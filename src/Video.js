import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Video.css';

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage, setVideosPerPage] = useState(6);

  // Fetch data from the API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/BeyondBox/all-activities');
        const activityData = response.data.activities;

        // Prepare the videos array with the necessary data
        const videoData = activityData.map(activity => ({
          url: activity.fileUrl,
          title: `Activity ${activity.activityNo}: ${activity.activityType}`,
          // Replace placeholder with real thumbnail or keep the placeholder if none available
          poster: activity.fileUrl.replace('raw', 'video').replace('.mp4', '.jpg') || 
                  `https://via.placeholder.com/320x180.png?text=Video+${activity.activityNo}`, 
        }));

        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Handle screen resizing for responsive pagination
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 768) setVideosPerPage(2);  // 2 videos per page for small screens
      else if (width < 992) setVideosPerPage(4); // 4 videos per page for medium screens
      else setVideosPerPage(6); // 6 videos per page for large screens
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const indexOfLast = currentPage * videosPerPage;
  const indexOfFirst = indexOfLast - videosPerPage;
  const currentVideos = videos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(videos.length / videosPerPage);

  return (
    <div className="video-page">
      <div className="container">
        <h2 className="video-title text-center mb-5">🎥 Fun Learning Videos for Kids</h2>
        <div className="video-grid">
          {currentVideos.map((video, index) => (
            <div key={index} className="video-card">
              <video controls className="video-player" poster={video.poster}>
                <source src={video.url} type="video/mp4" />
              </video>
              <div className="video-title-label text-center">{video.title}</div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination pagination-sm">
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
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
