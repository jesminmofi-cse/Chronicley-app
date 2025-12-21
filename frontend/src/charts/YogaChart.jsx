// src/Planner/BookTrackerPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Book.css';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxd5rhq4t/image/upload';
const UPLOAD_PRESET = 'chroniclely';

const BookTrackerPage = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [startedDate, setStartedDate] = useState('');
  const [finishedDate, setFinishedDate] = useState('');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('');
  const [review, setReview] = useState('');
  const [tags, setTags] = useState('');
  const [summary, setSummary] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/api/books', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🛡️ SAFE ARRAY EXTRACTION (CRITICAL)
      const raw = res?.data;
      const bookArray =
        Array.isArray(raw?.data) ? raw.data :
        Array.isArray(raw) ? raw :
        [];

      setBooks(bookArray);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setBooks([]);
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
      console.error('Image upload failed:', err);
      return '';
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImageUrl = await uploadImage();

      await axios.post(
        '/api/books',
        {
          title,
          startedDate,
          finishedDate,
          rating,
          status,
          review,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
          summary,
          imageUrl: uploadedImageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // reset form
      setTitle('');
      setStartedDate('');
      setFinishedDate('');
      setRating('');
      setStatus('');
      setReview('');
      setTags('');
      setSummary('');
      setImageFile(null);

      fetchBooks();
    } catch (err) {
      console.error('Error adding book:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="booktracker-container">
      <h2>Book Tracker</h2>

      <form className="booktracker-form" onSubmit={handleAddBook}>
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="date"
          value={startedDate}
          onChange={(e) => setStartedDate(e.target.value)}
          placeholder="Start Date"
        />

        <input
          type="date"
          value={finishedDate}
          onChange={(e) => setFinishedDate(e.target.value)}
          placeholder="Finish Date"
        />

        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Rating (1–5)"
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="">-- Status --</option>
          <option value="to read">To Read</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>

        <textarea
          placeholder="Review / Notes"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <textarea
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding…' : 'Add Book'}
        </button>
      </form>

      <div className="booktracker-items">
        {books.length === 0 ? (
          <p className="empty-msg">No books tracked yet. Add your first read! 📖</p>
        ) : (
          books.map((book) => (
            <div key={book._id} className="book-item">
              {book.imageUrl && (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="book-image"
                />
              )}

              <div className="book-info">
                <h3>{book.title}</h3>
                {book.status && <p>Status: {book.status}</p>}
                {book.rating && <p>Rating: {'⭐'.repeat(book.rating)}</p>}
                {book.tags?.length > 0 && <p>Tags: {book.tags.join(', ')}</p>}
                {book.startedDate && (
                  <p>Started: {new Date(book.startedDate).toLocaleDateString()}</p>
                )}
                {book.finishedDate && (
                  <p>Finished: {new Date(book.finishedDate).toLocaleDateString()}</p>
                )}
                {book.review && <p>Notes: {book.review}</p>}
                {book.summary && <p className="summary">Summary: {book.summary}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookTrackerPage;
