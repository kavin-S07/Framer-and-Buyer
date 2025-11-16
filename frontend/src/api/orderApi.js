import axios from './axiosConfig';

export const orderApi = {
  // Buyer endpoints
  createOrder: (data) => axios.post('/buyer/orders', data),
  getBuyerOrders: (status) => axios.get('/buyer/orders', { params: { status } }),
  getBuyerOrderById: (id) => axios.get(`/buyer/orders/${id}`),
  cancelOrder: (id) => axios.put(`/buyer/orders/${id}/cancel`),
  getOrderHistory: () => axios.get('/buyer/order-history'),
  getPendingOrders: () => axios.get('/buyer/orders/pending'),
  getBuyerStats: () => axios.get('/buyer/stats'),
  
  // Farmer endpoints
  getFarmerOrders: (status) => axios.get('/farmer/orders', { params: { status } }),
  getFarmerOrderById: (id) => axios.get(`/farmer/orders/${id}`),
  confirmOrder: (id) => axios.put(`/farmer/orders/${id}/confirm`),
  rejectOrder: (id) => axios.put(`/farmer/orders/${id}/reject`),
  completeOrder: (id) => axios.put(`/farmer/orders/${id}/complete`),
  getSalesHistory: () => axios.get('/farmer/sales-history'),
  getFarmerStats: () => axios.get('/farmer/stats'),
};