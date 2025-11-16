export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed'
};

export const ORDER_STATUS_COLORS = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  REJECTED: 'danger',
  CANCELLED: 'secondary',
  COMPLETED: 'success'
};

export const ROLES = {
  FARMER: 'FARMER',
  BUYER: 'BUYER'
};