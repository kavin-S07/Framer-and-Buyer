import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async () => {
    try {
      console.log('=== FARMER ORDER DETAILS ===');
      console.log('Fetching FARMER order with ID:', id);
      console.log('Calling: orderApi.getFarmerOrderById()');

      // ✅ MAKE SURE THIS CALLS getFarmerOrderById, NOT getBuyerOrderById
      const response = await orderApi.getFarmerOrderById(id);

      console.log('✅ Order response:', response.data);
      setOrder(response.data);
      setError('');
    } catch (err) {
      console.error('❌ Error fetching order:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

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
    if (!window.confirm('Are you sure you want to complete this order?')) return;

    try {
      await orderApi.completeOrder(id);
      fetchOrder();
    } catch (err) {
      alert('Failed to complete order');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="container"><div className="error-message">{error}</div></div>;
  if (!order) return <div className="container"><p>Order not found</p></div>;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-2">
        ← Back
      </button>

      <div className="card">
        {/* Order Header */}
        <div className="order-header">
          <div className="flex-between">
            <h2>Order #{order.id}</h2>
            <span className={`badge badge-${ORDER_STATUS_COLORS[order.status]}`}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>
        </div>

        {/* Order Meta Information */}
        <div className="order-meta">
          <div className="meta-item">
            <span className="meta-label">Order Date</span>
            <span className="meta-value">{formatDate(order.createdAt)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Order Status</span>
            <span className="meta-value">{ORDER_STATUS_LABELS[order.status]}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Total Amount</span>
            <span className="meta-value">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Buyer Information */}
        <div className="buyer-info">
          <h3>Buyer Details</h3>
          <div className="order-meta" style={{ background: 'white', marginTop: '15px' }}>
            <div className="meta-item">
              <span className="meta-label">Buyer ID</span>
              <span className="meta-value">{order.buyerId || "Not Provided"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Name</span>
              <span className="meta-value">{order.buyerName || "Not Provided"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Email</span>
              <span className="meta-value">{order.buyerEmail || "Not Provided"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Phone</span>
              <span className="meta-value">{order.buyerPhone || "Not Provided"}</span>
            </div>
            <div className="meta-item" style={{ gridColumn: '1 / -1' }}>
              <span className="meta-label">Address</span>
              <span className="meta-value">{order.buyerAddress || "Not Provided"}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items">
          <h3>Order Items</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
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

        {/* Order Total */}
        <div className="order-total">
          <h3>Total: {formatCurrency(order.totalAmount)}</h3>
        </div>

        {/* Action Buttons */}
        <div className="order-actions">
          {order.status === 'PENDING' && (
            <>
              <button onClick={handleConfirm} className="btn btn-success">
                ✓ Confirm Order
              </button>
              <button onClick={handleReject} className="btn btn-danger">
                ✗ Reject Order
              </button>
            </>
          )}
          {order.status === 'CONFIRMED' && (
            <button onClick={handleComplete} className="btn btn-primary">
              ✓ Mark as Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;