import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log helpful diagnostic message without breaking app flow
    if (error.response) {
      console.warn(`[PujaPath API] Server returned ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.warn('[PujaPath API] Network unreachable or server offline, falling back to local dataset.');
    } else {
      console.error('[PujaPath API] Request configuration error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

