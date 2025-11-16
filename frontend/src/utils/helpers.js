export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getUserData = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const setUserData = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUserData = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isFarmer = () => {
  const user = getUserData();
  return user && user.role === 'FARMER';
};

export const isBuyer = () => {
  const user = getUserData();
  return user && user.role === 'BUYER';
};