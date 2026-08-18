import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (email: string, password: string, name?: string) =>
    api.post('/auth/register', { email, password, name }),
  getProfile: () => api.get('/auth/profile'),
};

// Cards API
export const cardsAPI = {
  getAll: () => api.get('/cards'),
  getById: (id: string) => api.get(`/cards/${id}`),
  create: (data: CreateCardData) => api.post('/cards', data),
  update: (id: string, data: UpdateCardData) => api.put(`/cards/${id}`, data),
  delete: (id: string) => api.delete(`/cards/${id}`),
  incrementScan: (id: string) => api.post(`/cards/${id}/scan`),
};

// Upload API
export const uploadAPI = {
  uploadModel: async (file: File) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/upload/model`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
  uploadMarker: async (file: File) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/upload/marker`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
};

// Types
export interface Card {
  id: string;
  title: string;
  description?: string;
  markerImage: string;
  targetModel: string;
  modelScale: number;
  zoomLimit: number;
  qrCode?: string;
  isActive: boolean;
  scanCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardData {
  title: string;
  description?: string;
  markerImage: string;
  targetModel: string;
  modelScale?: number;
  zoomLimit?: number;
  isActive?: boolean;
}

export interface UpdateCardData {
  title?: string;
  description?: string;
  markerImage?: string;
  targetModel?: string;
  modelScale?: number;
  zoomLimit?: number;
  isActive?: boolean;
}

export default api;
