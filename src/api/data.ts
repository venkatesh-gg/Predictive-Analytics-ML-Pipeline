import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    const { state } = JSON.parse(token);
    if (state.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }
  return config;
});

export const dataApi = {
  uploadDataset: async (file: File) => {
    const formData = new FormData();
    formData.append('dataset', file);
    
    const response = await api.post('/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getDatasets: async () => {
    const response = await api.get('/datasets');
    return response.data;
  },
  
  getDataset: async (id: string) => {
    const response = await api.get(`/datasets/${id}`);
    return response.data;
  },
  
  trainModel: async (id: string) => {
    const response = await api.post(`/datasets/${id}/train`);
    return response.data;
  },
  
  getPredictions: async (id: string) => {
    const response = await api.get(`/datasets/${id}/predictions`);
    return response.data;
  },
};