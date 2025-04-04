import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.dinver.eu/api/app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;