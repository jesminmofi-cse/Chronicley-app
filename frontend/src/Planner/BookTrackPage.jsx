// src/Planner/BookTrackerPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api'; // ✅ USE AXIOS INSTANCE
import './Book.css';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxd5rhq4t/image/upload';
const UPLOAD_PRESET = 'chroniclely';

const BookTrackerPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [startedDate, setStartedDate] = useState('');
  const [finishedDate, setFinishedDate] = useState('');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('');
  const [review, setReview] = useState('');
  const [tags, setTags] = useState('');
  const [summary, setSummary] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/api/books');
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Fetch books failed:', err.response || err);
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const uploadImage = async () => {
    if (!imageFile) return '';
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.secure_url || '';
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      await api.post('/api/books', {
        title,
        startedDate,
        finishedDate,
        rating: rating ? Number(rating) : undefined,
        status,
        review,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        summary,
        imageUrl,
      });

      // reset
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
      console.error('Add book failed:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booktracker-container">
      <h2>Book Tracker</h2>

      <form className="booktracker-form" onSubmit={handleAddBook}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Book Title" required />
        <input type="date" value={startedDate} onChange={e => setStartedDate(e.target.value)} />
        <input type="date" value={finishedDate} onChange={e => setFinishedDate(e.target.value)} />
        <input type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)} required>
          <option value="">-- Status --</option>
          <option value="to read">To Read</option>
          <option value="reading">Reading</option>
          <option value="completed">Completed</option>
        </select>
        <textarea value={review} onChange={e => setReview(e.target.value)} placeholder="Notes" />
        <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" />
        <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Summary" />
        <input type="file" onChange={e => setImageFile(e.target.files[0])} />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding…' : 'Add Book'}
        </button>
      </form>

      <div className="booktracker-items">
        {books.length === 0 ? (
          <p>No books yet 📚</p>
        ) : (
          books.map((book) => (
            <div key={book._id} className="book-item">
              {book.imageUrl && <img src={book.imageUrl} alt={book.title} />}
              <h3>{book.title}</h3>
              {book.status && <p>Status: {book.status}</p>}
              {Number.isInteger(book.rating) && <p>Rating: {'⭐'.repeat(book.rating)}</p>}
              {book.tags?.length > 0 && <p>Tags: {book.tags.join(', ')}</p>}
              {book.startedDate && <p>Started: {new Date(book.startedDate).toLocaleDateString()}</p>}
              {book.finishedDate && <p>Finished: {new Date(book.finishedDate).toLocaleDateString()}</p>}
              {book.review && <p>{book.review}</p>}
              {book.summary && <p>{book.summary}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookTrackerPage;
