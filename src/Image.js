import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const allowedTopics = {
  archimedes: "Archimedes",
  mariecurie: "MarieCurie",
  tesla: "Tesla",
  einstein: "Einstein"
};

const ImageDisplay = () => {
  const { topic } = useParams();
  const normalizedTopic = topic.toLowerCase();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!allowedTopics.hasOwnProperty(normalizedTopic)) {
      setError("Invalid topic. Please select a valid topic.");
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      try {
        const response = await axios.get(`https://beyond-sfne.onrender.com/api/BeyondBox/${allowedTopics[normalizedTopic]}/Image`);
        setImages(response.data.activities || []);
      } catch (err) {
        setError("Error fetching images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [normalizedTopic]);

  const handleDownload = (fileUrl, activityNo) => {
    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `Activity_${activityNo}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      });
  };

  if (loading) {
    return <div style={styles.loading}>Loading images...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🖼 Images for {allowedTopics[normalizedTopic]}</h1>

      <div style={styles.grid}>
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image._id} style={styles.card}>
              <div style={styles.imageWrapper} onClick={() => setSelectedImage(image)}>
                <img src={image.fileUrl} alt={`Activity ${image.activityNo}`} style={styles.image} />
                <div style={styles.overlay}></div>
              </div>
              <p style={styles.activityNo}>Activity #{image.activityNo}</p>
              <button style={styles.downloadButton} onClick={() => handleDownload(image.fileUrl, image.activityNo)}>
                Download
              </button>
            </div>
          ))
        ) : (
          <p style={styles.noData}>No images available for this topic</p>
        )}
      </div>

      {selectedImage && (
        <div style={styles.popupOverlay} onClick={() => setSelectedImage(null)}>
          <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.fileUrl} alt={`Activity ${selectedImage.activityNo}`} style={styles.fullImage} />
            <button onClick={() => setSelectedImage(null)} style={styles.closeButton}>X</button>
          </div>
        </div>
      )}
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
  imageWrapper: {
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    filter: 'brightness(85%)',
    transition: 'transform 0.3s ease',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.15)',
  },
  activityNo: {
    marginTop: '15px',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  downloadButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#FF9800',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '16px',
    cursor: 'pointer',
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
  },

  // Popup styles
  popupOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    position: 'relative',
    background: '#fff',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    maxWidth: '90%',
    maxHeight: '90%',
  },
  fullImage: {
    maxWidth: '100%',
    maxHeight: '80vh',
    borderRadius: '10px',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: '#FF5722',
    border: 'none',
    color: '#fff',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    fontSize: '18px',
    cursor: 'pointer',
  }
};

export default ImageDisplay;
