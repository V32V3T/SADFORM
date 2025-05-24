import React, { createContext, useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000/api'; 

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true); 

  const storeToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const removeToken = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const fetchUserDetails = useCallback(async (authToken) => {
    if (!authToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        removeToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user details', error);
      removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  
  useEffect(() => {
    fetchUserDetails(token);
  }, [token, fetchUserDetails]);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); 
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (response.ok) {
      const data = await response.json();
      storeToken(data.access_token);
      await fetchUserDetails(data.access_token); 
    } else {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }
  };

  const signup = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Signup failed');
    }
    
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup, isLoading, fetchUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
}; 