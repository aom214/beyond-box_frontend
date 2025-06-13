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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!allowedTopics.includes(topic)) {
      setError(`Invalid topic: ${topic}`);
      setLoading(false);
      return;
    }

    const checkExisting = async () => {
      try {
        const response = await axios.get(`https://beyond-sfne.onrender.com/api/BeyondBox/${userId}/${topic}/${activityNo}`);
        if (response.data.details?.videoSubmitted === true) {
          setAlreadySubmitted(true);
        }
      } catch (err) {
        setError("Error checking existing video.");
      } finally {
        setLoading(false);
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
      await axios.post(`https://beyond-sfne.onrender.com/api/BeyondBox/${userId}/${topic}/${activityNo}/Video`, formData);
      setSuccess("Video uploaded successfully!");
      setAlreadySubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Error uploading video.");
    } finally {
      setUploading(false);
    }
  };

  // 🔄 Full screen spinner while uploading
  if (uploading) {
    return (
      <div style={styles.uploadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.uploadingNote}>Please do not refresh or close the page while uploading.</p>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🎥 Upload Your Video!</h1>
      <h2 style={styles.subHeading}>{topic} - Activity {activityNo}</h2>

      {alreadySubmitted ? (
        <p style={styles.successMessage}>✅ Video submitted for this activity!</p>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Choose Video File:</label>
            <input type="file" accept="video/*" onChange={handleVideoChange} style={styles.input} />
          </div>

          {error && <p style={styles.errorMessage}>{error}</p>}
          {success && <p style={styles.successMessage}>{success}</p>}

          <div style={styles.buttonContainer}>
            <button type="submit" disabled={uploading} style={styles.button}>
              Upload Video
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%)',
    minHeight: '100vh',
    padding: '30px',
    textAlign: 'center',
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
  },
  heading: {
    fontSize: '36px',
    color: '#FF5722',
    marginBottom: '10px',
  },
  subHeading: {
    fontSize: '22px',
    color: '#555',
    marginBottom: '30px',
  },
  form: {
    background: '#FFFFFF',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
    maxWidth: '500px',
    margin: '0 auto',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '20px',
    color: '#555',
    marginBottom: '10px',
    display: 'block',
  },
  input: {
    fontSize: '16px',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    width: '80%',
  },
  buttonContainer: {
    marginTop: '20px',
  },
  button: {
    fontSize: '20px',
    padding: '10px 30px',
    borderRadius: '50px',
    backgroundColor: '#FFD54F',
    color: '#333',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  successMessage: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  loadingContainer: {
    background: '#FFF9C4',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
  },
  uploadingContainer: {
    background: '#FFF9C4',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Comic Sans MS", cursive, sans-serif',
  },
  spinner: {
    border: '8px solid #FFF3E0',
    borderTop: '8px solid #FF9800',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    animation: 'spin 1s linear infinite',
  },
  uploadingNote: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#D84315',
    fontWeight: 'bold',
  }
};

export default VideoUpload;
