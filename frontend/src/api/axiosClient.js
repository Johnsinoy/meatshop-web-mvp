import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5050/api/v1', // Matches your backend port [cite: 56]
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;