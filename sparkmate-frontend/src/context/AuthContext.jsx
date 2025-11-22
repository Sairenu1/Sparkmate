import React, { useState, useEffect, createContext, useContext } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// API BASE URL - Change this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:8080/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // SAFE JSON PARSE FUNCTION
  const safeParseJSON = (value) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error("Invalid JSON in localStorage. Clearing...");
      localStorage.removeItem("sparkmate_user");
      return null;
    }
  };

  // CHECK AUTH ON MOUNT
  useEffect(() => {
    checkAuth();
  }, []);

  // CHECK IF USER IS AUTHENTICATED
  const checkAuth = () => {
    try {
      const savedUser = localStorage.getItem('sparkmate_user');
      const token = localStorage.getItem('sparkmate_token');

      if (savedUser && token) {
        const parsedUser = safeParseJSON(savedUser);
        if (parsedUser) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN FUNCTION - CALLS REAL BACKEND API
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Extract user data from response
        const userData = {
          id: data.data.userId || data.data.id,
          name: data.data.name || email.split('@')[0],
          email: email,
          token: data.data.token,
          isPremium: data.data.isPremium || false
        };

        // Save to state and localStorage
        setUser(userData);
        localStorage.setItem('sparkmate_user', JSON.stringify(userData));
        localStorage.setItem('sparkmate_token', data.data.token);

        toast.success('Welcome back! 💕');
        return { success: true, user: userData };
      } else {
        toast.error(data.message || 'Invalid credentials');
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Unable to connect to server. Please try again.');
      return { success: false, message: 'Network error' };
    }
  };

  // SIGNUP FUNCTION - CALLS REAL BACKEND API
  const signup = async (signupData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Account created successfully! Please login.');
        return { success: true };
      } else {
        toast.error(data.message || 'Signup failed');
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Unable to connect to server. Please try again.');
      return { success: false, message: 'Network error' };
    }
  };

  // LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sparkmate_user');
    localStorage.removeItem('sparkmate_token');
    toast.success('Logged out successfully');
  };

  // GET AUTH HEADER FOR API CALLS
  const getAuthHeader = () => {
    const token = localStorage.getItem('sparkmate_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // CHECK IF USER IS AUTHENTICATED
  const isAuthenticated = () => {
    return user !== null && localStorage.getItem('sparkmate_token') !== null;
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
            scale: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <Heart size={50} fill="#ff006e" color="#ff006e" />
        </motion.div>
      </div>
    );
  }

  // CONTEXT PROVIDER
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      getAuthHeader,
      isAuthenticated: isAuthenticated(),
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};