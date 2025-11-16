import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getFarmerOrderById(id);
      setOrder(response.data);
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!window.confirm('Are you sure you want to confirm this order?')) return;
    try {
      await orderApi.confirmOrder(id);
      fetchOrder();
    } catch (err) {
      alert('Failed to confirm order');
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this order?')) return;
    try {
      await orderApi.rejectOrder(id);
      fetchOrder();
    } catch (err) {
      alert('Failed to reject order');
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Are you sure you want to mark this order as complete?')) return;
    try {
      await orderApi.completeOrder(id);
      fetchOrder();
    } catch (err) {
      alert('Failed to complete order');
    }
  };

  if (loading) return (
    <div className="container">
      <div className="loading-container">
        <Loading />
      </div>
    </div>
  );

  if (error) return (
    <div className="container">
      <div className="error-message">{error}</div>
    </div>
  );

  if (!order) return (
    <div className="container">
      <p>Order not found</p>
    </div>
  );

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn btn-secondary">
        ← Back to Orders
      </button>

      <div className="card">
        <div className="order-header">
          <div className="flex-between">
            <h2>Order #{order.id}</h2>
            <span className={`badge badge-${ORDER_STATUS_COLORS[order.status]}`}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>

          <div className="order-meta">
            <div className="meta-item">
              <span className="meta-label">Order Date</span>
              <span className="meta-value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Total Amount</span>
              <span className="meta-value">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="buyer-info">
          <h3>Buyer Information</h3>
          <p><strong>Name:</strong> {order.buyerName}</p>
        </div>

        <div className="order-items">
          <h3>Order Items</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.priceEach)}</td>
                  <td>{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-total">
          <h3>Total Amount: {formatCurrency(order.totalAmount)}</h3>
        </div>

        <div className="order-actions">
          {order.status === 'PENDING' && (
            <>
              <button onClick={handleConfirm} className="btn btn-success">
                Confirm Order
              </button>
              <button onClick={handleReject} className="btn btn-danger">
                Reject Order
              </button>
            </>
          )}
          {order.status === 'CONFIRMED' && (
            <button onClick={handleComplete} className="btn btn-primary">
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;