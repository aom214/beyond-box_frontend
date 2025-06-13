import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const allowedTopics = ["Archimedes", "Marie Curie", "Tesla", "Einstein"];

const ImageUpload = () => {
  const { userId, topic, activityNo } = useParams();

  const [imageFile, setImageFile] = useState(null);
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

    // Check if image already submitted
    const checkExisting = async () => {
      try {
        const response = await axios.get(`https://beyond-sfne.onrender.com/${userId}/${topic}/Image`);
        const exists = response.data.activities.some(item => item.activityNo.toString() === activityNo);
        if (exists) {
          setAlreadySubmitted(true);
        }
      } catch (err) {
        setError("Error checking existing image.");
      }
    };

    checkExisting();
  }, [userId, topic, activityNo]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setError("Please select an image file.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      await axios.post(`https://beyond-sfne.onrender.com/api/BeyondBox${userId}/${topic}/${activityNo}/Image`, formData);
      setSuccess("Image uploaded successfully!");
      setAlreadySubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Image: {topic} - Activity {activityNo}</h1>

      {alreadySubmitted ? (
        <p style={{ color: "green", fontWeight: "bold" }}>Image already submitted for this activity!</p>
      ) : (
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Choose Image File:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="submit-button-container">
            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ImageUpload;
