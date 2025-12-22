import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Book.css';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxd5rhq4t/image/upload';
const UPLOAD_PRESET = 'chroniclely';
const API_URL = process.env.REACT_APP_API_URL;

const BookTracker = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [startedDate, setStartedDate] = useState('');
  const [finishedDate, setFinishedDate] = useState('');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('');
  const [review, setReview] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem('token');

  /* ======================
     FETCH BOOKS (SAFE)
     ====================== */
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = res?.data;
      const bookArray =
        Array.isArray(raw?.data) ? raw.data :
        Array.isArray(raw) ? raw :
        [];

      setBooks(bookArray);
      setError('');
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setBooks([]);
      setError('Failed to load books');
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, []);

  /* ======================
     IMAGE UPLOAD
     ====================== */
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

  /* ======================
     ADD BOOK
     ====================== */
  const handleAddBook = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const uploadedImageUrl = await uploadImage();

      await axios.post(
        `${API_URL}/api/books`,
        {
          title,
          startedDate,
          finishedDate,
          rating: rating ? Number(rating) : undefined,
          status,
          review,
          summary,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          imageUrl: uploadedImageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // reset
      setTitle('');
      setStartedDate('');
      setFinishedDate('');
      setRating('');
      setStatus('');
      setReview('');
      setSummary('');
      setTags('');
      setImageFile(null);

      fetchBooks();
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     DELETE BOOK
     ====================== */
  const deleteBook = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/books/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBooks();
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  /* ======================
     RENDER
     ====================== */
  return (
    <div className="booktracker-container">
      <h2>My Reading Log 📚</h2>

      <form className="booktracker-form" onSubmit={handleAddBook}>
        <input
          type="text"
          placeholder="Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="date"
          value={startedDate}
          onChange={(e) => setStartedDate(e.target.value)}
        />

        <input
          type="date"
          value={finishedDate}
          onChange={(e) => setFinishedDate(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="">-- Status --</option>
          <option value="to read">To Read</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1–5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <textarea
          placeholder="Notes / Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <textarea
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="booktracker-items">
        {books.length === 0 ? (
          <p className="empty-msg">No books yet. Let’s read something 📖</p>
        ) : (
          books.map((book) => (
            <div key={book._id} className="book-item">
              <div className="book-info">
                <h3>{book.title}</h3>
                {book.status && <small>Status: {book.status}</small>}
                {book.rating && <p>⭐ {book.rating}/5</p>}
                {book.startedDate && (
                  <p>Started: {new Date(book.startedDate).toLocaleDateString()}</p>
                )}
                {book.finishedDate && (
                  <p>Finished: {new Date(book.finishedDate).toLocaleDateString()}</p>
                )}
                {book.tags?.length > 0 && <p>Tags: {book.tags.join(', ')}</p>}
                {book.review && <p>{book.review}</p>}
                {book.summary && <p>{book.summary}</p>}
              </div>

              {book.imageUrl && (
                <img src={book.imageUrl} alt={book.title} className="book-image" />
              )}

              <button
                className="delete-btn"
                onClick={() => deleteBook(book._id)}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookTracker;
