import axios from 'axios';

const api = axios.create({
  baseURL: '',           // để trống → dùng proxy /api/...
  headers: { 'Content-Type': 'application/json' },
});

export default api;