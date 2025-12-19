// src/Planner/wishList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './wishList.css';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxd5rhq4t/image/upload';
const UPLOAD_PRESET = 'chroniclely';

const WishList = () => {
  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [imageFile, setImageFile] = useState(null); 
  const [loading, setLoading] = useState(false);

  const fetchWishes = async () => {
    try {
      const res = await axios.get('/api/wishlist', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWishes(res.data);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err.message);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return '';
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData);
      return response.data.secure_url;
    } catch (err) {
      console.error('Image upload failed:', err.message);
      return '';
    }
  };

  const handleAddWish = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploadedImageUrl = await uploadImage(); // ✅ Upload first
      await axios.post('/api/wishlist',
        { title: newWish, targetDate, imageUrl: uploadedImageUrl },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setNewWish('');
      setTargetDate('');
      setImageFile(null);
      fetchWishes();
    } catch (err) {
      console.error('Error adding wish:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleWish = async (id) => {
    try {
      await axios.put(`/api/wishlist/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchWishes();
    } catch (err) {
      console.error('Error toggling wish:', err.message);
    }
  };

  const deleteWish = async (id) => {
    try {
      await axios.delete(`/api/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchWishes();
    } catch (err) {
      console.error('Error deleting wish:', err.message);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  return (
   
    <div className="wishlist-container">
      <h2>My Dream Wishlist ✨</h2>
      <form className="wishlist-form" onSubmit={handleAddWish}>
        <input
          type="text"
          placeholder="What's your wish?"
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
          required
        />
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Wish'}
        </button>
      </form>

      <div className="wishlist-items">
        {wishes.length === 0 ? (
          <p className="empty-msg">No wishes yet. Dream big! 💫</p>
        ) : (
          wishes.map((wish) => (
            <div key={wish._id} className={`wish-item ${wish.isFulfilled ? 'fulfilled' : ''}`}>
              <div className="wish-info" onClick={() => toggleWish(wish._id)}>
                <span>{wish.title}</span>
                {wish.targetDate && (
                  <small>🎯 {new Date(wish.targetDate).toLocaleDateString()}</small>
                )}
              </div>
              {wish.imageUrl && (
                <img src={wish.imageUrl} alt={wish.title} className="wish-image" />
              )}
              <button className="delete-btn" onClick={() => deleteWish(wish._id)}>🗑️</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishList;
