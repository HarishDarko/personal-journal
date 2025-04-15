import axios from 'axios'
import API_BASE_URL from '../config/api'

const API_URL = `${API_BASE_URL}/journal`

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Get all journal entries for a user with search and filtering
export const getJournalEntries = async (filters = {}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();

    // Add search and filter parameters if they exist
    if (filters.search) params.append('search', filters.search);
    if (filters.mood && filters.mood !== 'all') params.append('mood', filters.mood);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.tags) params.append('tags', filters.tags);
    if (filters.sortField) params.append('sortField', filters.sortField);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await axios.get(`${API_URL}?${params.toString()}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch journal entries')
  }
}

// Get a single journal entry
export const getJournalEntry = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch journal entry')
  }
}

// Create a new journal entry
export const createJournalEntry = async (journalData) => {
  try {
    const response = await axios.post(API_URL, journalData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create journal entry')
  }
}

// Update a journal entry
export const updateJournalEntry = async (id, journalData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, journalData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update journal entry')
  }
}

// Delete a journal entry
export const deleteJournalEntry = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete journal entry')
  }
}
