import axios from 'axios';
import API_URL from '../config/api';

const AUTH_URL = `${API_URL}/auth`;

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, userData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

// Login user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, userData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await axios.get(`${AUTH_URL}/logout`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Logout failed');
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${AUTH_URL}/me`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    // Don't throw an error here, just return null
    // This is because we use this to check if the user is logged in
    return null;
  }
};
