import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Programs from './pages/Programs';
import Workouts from './pages/Workouts';
import WorkoutLogger from './pages/WorkoutLogger';
import Nutrition from './pages/Nutrition';
import MealLogger from './pages/MealLogger';
import CheckIn from './pages/CheckIn';
import Progress from './pages/Progress';
import Premium from './pages/Premium';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AdBanner from './components/AdBanner';

import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { user } = useAuth();
  const showAds = user && user.subscription?.plan === 'free';

  return (
    <Router>
      <div className="app">
        <Toaster position="top-right" />
        
        {user && <Navbar />}
        
        <div className="app-container">
          {user && <Sidebar />}
          
          <main className="main-content">
            {showAds && <AdBanner position="top" />}
            
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              
              <Route path="/programs" element={
                <PrivateRoute>
                  <Programs />
                </PrivateRoute>
              } />
              
              <Route path="/workouts" element={
                <PrivateRoute>
                  <Workouts />
                </PrivateRoute>
              } />
              
              <Route path="/workouts/log" element={
                <PrivateRoute>
                  <WorkoutLogger />
                </PrivateRoute>
              } />
              
              <Route path="/nutrition" element={
                <PrivateRoute>
                  <Nutrition />
                </PrivateRoute>
              } />
              
              <Route path="/nutrition/log" element={
                <PrivateRoute>
                  <MealLogger />
                </PrivateRoute>
              } />
              
              <Route path="/checkin" element={
                <PrivateRoute>
                  <CheckIn />
                </PrivateRoute>
              } />
              
              <Route path="/progress" element={
                <PrivateRoute>
                  <Progress />
                </PrivateRoute>
              } />
              
              <Route path="/premium" element={
                <PrivateRoute>
                  <Premium />
                </PrivateRoute>
              } />
            </Routes>
            
            {showAds && <AdBanner position="bottom" />}
          </main>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;