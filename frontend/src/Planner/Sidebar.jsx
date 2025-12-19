import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { token } = useAuth();
  const location = useLocation();

  // If not logged in, don't render sidebar
  if (!token) return null;

  // Optional helper to add active class
  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <div className="sidebar">
      <h3>
        <Link to="/home" className="brand">Chroniclely</Link>
      </h3>

      <ul>
        <li><Link to="/home" className={isActive('/home')}>Home</Link></li>
        <li><Link to="/calendar" className={isActive('/calendar')}>Calendar</Link></li>
        <li><Link to="/yoga" className={isActive('/yoga')}>Yoga Tracker</Link></li>
        <li><Link to="/sleep" className={isActive('/sleep')}>Sleep Tracker</Link></li>
        <li><Link to="/mood" className={isActive('/mood')}>Mood Tracker</Link></li>
        <li><Link to="/water" className={isActive('/water')}>Water Tracker</Link></li>
        <li><Link to="/task" className={isActive('/task')}>Task Tracker</Link></li>
        <li><Link to="/journal" className={isActive('/journal')}>Journal</Link></li>
        <li><Link to="/photo" className={isActive('/photo')}>Photo Journal</Link></li>
        <li><Link to="/gratitude" className={isActive('/gratitude')}>Gratitude Journal</Link></li>
        <li><Link to="/books" className={isActive('/books')}>Book Tracker</Link></li>
        <li><Link to="/period" className={isActive('/period')}>Period Tracker</Link></li>
        <li><Link to="/wishlist" className={isActive('/wishlist')}>Wish List</Link></li>
        <li><Link to="/meditation" className={isActive('/meditation')}>Meditation</Link></li>
        <li><Link to="/breathing" className={isActive('/breathing')}>Wim Hoff Breathing</Link></li>
        <li><Link to="/juice" className={isActive('/juice')}>Magic Potion for the Day</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
