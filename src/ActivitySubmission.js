import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './VideoUpload.css'; // Import the CSS for styling

const VideoUpload = () => {
  // Dynamic route parameter (activity number)
  const { activityNumber } = useParams();
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle file input change
  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
    setError(null); // Reset error message if a new file is selected
    setSuccess(null); // Reset success message
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!videoFile) {
      setError("Please select a video file first.");
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    setUploading(true);
    setError(null); // Reset previous error

    try {
      const response = await axios.post(`https://beyond-sfne.onrender.com/api/BeyondBox/activity/${activityNumber}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Video uploaded successfully!');
      console.log(response.data); // Log response from the backend
    } catch (error) {
      setError('Error uploading video: ' + error.response?.data?.error || error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Video for Activity {activityNumber}</h1>

      {/* Form to upload video */}
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="videoFile" className="file-label">Choose Video File:</label>
          <input
            type="file"
            id="videoFile"
            accept="video/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {/* Show error or success messages */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="submit-button-container">
          <button type="submit" className="submit-button" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoUpload;
