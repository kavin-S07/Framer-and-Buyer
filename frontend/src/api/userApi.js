import axios from './axiosConfig';

export const userApi = {
  getCurrentUser: () => axios.get('/users/me'),
  updateProfile: (data) => axios.put('/users/me', data),
  getUserById: (id) => axios.get(`/users/${id}`),
};