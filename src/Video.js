import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// ✅ Centralized allowed topics with normalization mapping
const allowedTopics = {
  archimedes: "Archimedes",
  mariecurie: "MarieCurie",
  tesla: "Tesla",
  einstein: "Einstein"
};

const VideoDisplay = () => {
  const { topic } = useParams();
  const normalizedTopic = topic.toLowerCase();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!allowedTopics.hasOwnProperty(normalizedTopic)) {
      setError("Invalid topic. Please select a valid topic.");
      setLoading(false);
      return;
    }

    const fetchVideos = async () => {
      try {
        const response = await axios.get(`https://beyond-sfne.onrender.com/api/BeyondBox/${allowedTopics[normalizedTopic]}/Video`);
        setVideos(response.data.activities || []);
      } catch (err) {
        setError("Error fetching videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [normalizedTopic]);

  if (loading) {
    return <div style={styles.loading}>Loading videos...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎥 Videos for {allowedTopics[normalizedTopic]}</h1>

      <div style={styles.grid}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video._id} style={styles.card}>
              <div style={styles.videoWrapper}>
                <video style={styles.video} controls>
                  <source src={video.fileUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p style={styles.activityNo}>Activity #{video.activityNo}</p>
            </div>
          ))
        ) : (
          <p style={styles.noData}>No videos available for this topic</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
    background: 'linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%)',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '32px',
    textAlign: 'center',
    color: '#FF5722',
    marginBottom: '30px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    padding: '15px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  },
  videoWrapper: {
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  activityNo: {
    marginTop: '15px',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '24px',
    color: '#FF9800',
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '24px',
    color: 'red',
  },
  noData: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '20px',
    color: '#999',
  }
};

export default VideoDisplay;
