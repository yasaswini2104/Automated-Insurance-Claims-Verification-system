import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const loginRequest = async (email, password) => {
  const res = await axios.post(`${BASE}/auth/login`, { email, password });
  return res.data; // returns JWT token string
};