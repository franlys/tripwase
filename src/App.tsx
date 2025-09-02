import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { TripProvider } from './contexts/TripContext';

import Navigation from './components/Navigation';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AdvancedSearch from './components/AdvancedSearch';
import TripPlanner from './components/TripPlanner';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationContainer from './components/ui/NotificationContainer';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <TripProvider>
          <Router>
            <div className="App">
              <Navigation />
              <NotificationContainer />
              
              <Routes>
                <Route path="/" element={<Home />} />
                
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/search" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <AdvancedSearch />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/planner" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <TripPlanner />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/planner/:tripId" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <TripPlanner />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>
        </TripProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
