import React, { useContext } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RecommendationPage from './components/RecommendationPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { AuthContext } from './context/AuthContext';
import './App.css';


const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return <div>Loading...</div>; 
  }
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isLoading } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <div className="App">
      <nav className="app-nav">
        {user && location.pathname === '/recommendations' && (
          <Link to="/" className="nav-link-home">Home (Landing)</Link>
        )}
        {user && (
          <button onClick={handleLogout} className="nav-link-logout">Logout ({user.email})</button>
        )}
        {!user && !isLoading && location.pathname !== '/login' && location.pathname !== '/signup' && (
          <>
            <Link to="/login" className="nav-link-auth">Login</Link>
            <Link to="/signup" className="nav-link-auth">Sign Up</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/recommendations" 
          element={ 
            <ProtectedRoute>
              <RecommendationPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      
      <footer className="app-footer">
        <p>Spotify Recommendation Engine © 2024</p>
        <p>
            <a href="https://github.com/V32V3T/SONG_RECOMMENDER" target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
