import axios from 'axios';

// Base URL of the backend API
const API_URL = 'https://localhost:7234/api';

// Axios instance shared by all services
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT to every outgoing request when present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Clear session and redirect to login on 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints
export const authService = {
  register: (email: string, password: string, fullName: string) =>
    api.post('/auth/register', { email, password, fullName }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

// Task CRUD endpoints
export const taskService = {
  getAll: () => api.get('/tasks'),

  getById: (id: number) => api.get(`/tasks/${id}`),

  create: (data: { title: string; description?: string }) =>
    api.post('/tasks', data),

  update: (
    id: number,
    data: { title: string; description?: string; isCompleted: boolean }
  ) => api.put(`/tasks/${id}`, { id, ...data }),

  delete: (id: number) => api.delete(`/tasks/${id}`),
};