import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Set up axios defaults when token changes
  useEffect(() => {
    if (token) {
      console.log('Setting auth token in axios defaults:', token.substring(0, 10) + '...');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      console.log('Removing auth token from axios defaults');
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Get current user info
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/auth/me');
        setCurrentUser(response.data.user);
      } catch (err) {
        console.error('Failed to load user', err);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register a new user
  const register = async (username, email, password) => {
    setError('');
    try {
      console.log('Registering user:', { username, email });
      const response = await axios.post('/api/auth/register', 
        { username, email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      console.log('Registration successful:', response.data);
      const newToken = response.data.token;
      
      // Set the token in localStorage and axios defaults
      setToken(newToken);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    setError('');
    try {
      console.log('Logging in user:', { email });
      const response = await axios.post('/api/auth/login', 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      console.log('Login successful:', response.data);
      const newToken = response.data.token;
      
      // Set the token in localStorage and axios defaults
      setToken(newToken);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      setCurrentUser(response.data.user);
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
