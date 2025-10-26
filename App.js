import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';
import api from './services/api';

function App() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAuth(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {auth && <Navbar setAuth={setAuth} />}
        <Routes>
          <Route path="/login" element={auth ? <Navigate to="/dashboard" /> : <Login setAuth={setAuth} />} />
          <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/analytics" element={auth ? <Analytics /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={auth ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
