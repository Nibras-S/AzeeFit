import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import PageHome from './pages/PageHome';
import PageActive from './pages/PageActive';
import PageInActive from './pages/PageInActive';
import PageNewMember from './pages/PageNewMember';
import PageExpired from './pages/PageExpired';
import AdminAuth from './components/admin/adminauth';

import './App.css';

// Protected Route Component
function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/admin" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };
  

  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<PageHome setIsAuthenticated={setIsAuthenticated} />} />
        {/* Login Route */}
        <Route path="/admin" element={<AdminAuth onLoginSuccess={handleLoginSuccess} />} />
        {/* Protected Routes */}
        <Route
          path="/active"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PageActive />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inactive"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PageInActive />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expired"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PageExpired />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PageNewMember />
            </ProtectedRoute>
          }
        />
        {/* Default Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;