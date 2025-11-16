import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { 
  getToken, 
  setToken, 
  removeToken, 
  getUserData, 
  setUserData, 
  removeUserData 
} from '../utils/helpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const userData = getUserData();
    if (token && userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      const { token, ...userData } = response.data;
      
      setToken(token);
      setUserData(userData);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const signup = async (data) => {
    try {
      const response = await authApi.signup(data);
      const { token, ...userData } = response.data;
      
      setToken(token);
      setUserData(userData);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    removeToken();
    removeUserData();
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
    isFarmer: user?.role === 'FARMER',
    isBuyer: user?.role === 'BUYER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};