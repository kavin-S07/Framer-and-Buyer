import axios from './axiosConfig';

export const authApi = {
  signup: (data) => axios.post('/auth/signup', data),
  login: (data) => axios.post('/auth/login', data),
  test: () => axios.get('/auth/test'),
};