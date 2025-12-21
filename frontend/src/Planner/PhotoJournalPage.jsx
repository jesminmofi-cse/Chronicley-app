// src/Planner/PhotoJournalPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhotoJournalPage.css';
import { FaTrash } from 'react-icons/fa';

const CLOUDINARY_URL =
  'https://api.cloudinary.com/v1_1/dxd5rhq4t/image/upload';
const UPLOAD_PRESET = 'chroniclely';

const API_URL = process.env.REACT_APP_API_URL;

const PhotoJournalPage = () => {
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) fetchPhotos();
    // eslint-disable-next-line
  }, [token]);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/photos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const raw = res?.data;
      const photoArray =
        Array.isArray(raw?.data) ? raw.data :
        Array.isArray(raw) ? raw :
        [];

      setPhotos(photoArray);
      setError('');
    } catch (err) {
      console.error('Failed to fetch photos:', err);
      setPhotos([]);
      setError('Failed to load photos');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');

    if (!imageFile) {
      setError('Please choose an image');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', UPLOAD_PRESET);

      const cloudRes = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = cloudRes.data.secure_url;

      await axios.post(
        `${API_URL}/api/photos`,
        { imageUrl, caption },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setImageFile(null);
      setCaption('');
      fetchPhotos();
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/photos/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPhotos();
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('Delete failed');
    }
  };

  return (
    <div className="photo-page">
      <h2>📸 Photo Journal</h2>

      <form onSubmit={handleUpload} className="photo-form">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="photo-grid">
        {photos.length === 0 ? (
          <p className="empty">
            No photos yet. Start capturing your days 📷
          </p>
        ) : (
          photos.map((photo) => (
            <div key={photo._id} className="photo-card">
              <img src={photo.imageUrl} alt="memory" />
              <p>{photo.caption}</p>
              <span>
                {photo.createdAt
                  ? new Date(photo.createdAt).toLocaleDateString()
                  : ''}
              </span>
              <FaTrash
                className="icon"
                onClick={() => deletePhoto(photo._id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PhotoJournalPage;
