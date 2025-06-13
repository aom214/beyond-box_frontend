import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const allowedTopics = ["Archimedes", "Marie Curie", "Tesla", "Einstein"];

const VideoUpload = () => {
  const { userId, topic, activityNo } = useParams();

  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    // Validate topic
    if (!allowedTopics.includes(topic)) {
      setError(`Invalid topic: ${topic}`);
      return;
    }

    // Check if video already submitted
    const checkExisting = async () => {
      try {
        const response = await axios.get(`https://beyond-sfne.onrender.com/api/BeyondBox/${userId}/${topic}/Video`);
        const exists = response.data.activities.some(item => item.activityNo.toString() === activityNo);
        if (exists) {
          setAlreadySubmitted(true);
        }
      } catch (err) {
        setError("Error checking existing video.");
      }
    };

    checkExisting();
  }, [userId, topic, activityNo]);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', videoFile);
      await axios.post(`https://beyond-sfne.onrender.com/${userId}/${topic}/${activityNo}/Video`, formData);
      setSuccess("Video uploaded successfully!");
      setAlreadySubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Error uploading video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Video: {topic} - Activity {activityNo}</h1>

      {alreadySubmitted ? (
        <p style={{ color: "green", fontWeight: "bold" }}>Video already submitted for this activity!</p>
      ) : (
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Choose Video File:</label>
            <input type="file" accept="video/*" onChange={handleVideoChange} />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="submit-button-container">
            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default VideoUpload;
