import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Auth/LoginPage';
import RegisterPage from './Auth/RegisterPage';
import ProtectedRoute from './Auth/ProtectedRoute';
import AffirmationPage from './Planner/AffirmationPage';
import HomePage from './Planner/HomePage';
import YogaPage from './Planner/YogaPage';
import FocusSession from './Planner/FocusSession';
import SleepPage from './Planner/SleepPage';
import WaterPage from './Planner/WaterPage';
import TaskPage from './Planner/TaskPage';
import MoodPage from './Planner/MoodPage';
import JournalPage from './Planner/JournalPage';
import GratitudePage from './Planner/GratitudePage';
import PeriodTrackerPage from './Planner/PeriodTrackerPage';
import WishPage from './Planner/wishList';
import BookTrackerPage from './Planner/BookTrackPage';
import CalendarView from './Planner/CalendarView';
import MeditationPage from './Planner/MeditationPage';
import BreathingPage from './Planner/BreathingPage';
import JuiceRecommendations from './Planner/JuiceRecommendation';
import PhotoJournalPage from './Planner/PhotoJournalPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={
          <ProtectedRoute><HomePage /></ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute><CalendarView /></ProtectedRoute>
        } />
          <Route path="/affirmations" element={
          <ProtectedRoute><AffirmationPage /></ProtectedRoute>
        } />
        <Route path="/yoga" element={
          <ProtectedRoute><YogaPage /></ProtectedRoute>
        } />
        <Route path="/focus" element={
          <ProtectedRoute><FocusSession /></ProtectedRoute>
        } />
        <Route path="/sleep" element={
          <ProtectedRoute><SleepPage /></ProtectedRoute>
        } />
        <Route path="/water" element={
          <ProtectedRoute><WaterPage /></ProtectedRoute>
        } />
        <Route path="/task" element={
          <ProtectedRoute><TaskPage /></ProtectedRoute>
        } />
        <Route path="/mood" element={
          <ProtectedRoute><MoodPage /></ProtectedRoute>
        } />
        <Route path="/journal" element={
          <ProtectedRoute><JournalPage /></ProtectedRoute>
        } />
        <Route path="/photo" element={
          <ProtectedRoute><PhotoJournalPage /></ProtectedRoute>
        } />
        <Route path="/gratitude" element={
          <ProtectedRoute><GratitudePage /></ProtectedRoute>
        } />
        <Route path="/books" element={
          <ProtectedRoute><BookTrackerPage /></ProtectedRoute>
        } />
        <Route path="/period" element={
          <ProtectedRoute><PeriodTrackerPage /></ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute><WishPage /></ProtectedRoute>
        } />
        <Route path="/meditation" element={
          <ProtectedRoute><MeditationPage /></ProtectedRoute>
        } />
        <Route path="/breathing" element={
          <ProtectedRoute><BreathingPage /></ProtectedRoute>
        } />
        <Route path="/juice" element={
          <ProtectedRoute><JuiceRecommendations /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
export default App;
