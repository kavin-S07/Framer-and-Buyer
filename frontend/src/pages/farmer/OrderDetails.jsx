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
      setLoading(true);
      setError('');

      // ✅ FIXED: Use getFarmerOrderById instead of getOrderById
      const response = await orderApi.getFarmerOrderById(id);
      setOrder(response.data);

    } catch (err) {
      console.error('Error fetching order:', err);

      let errorMessage = 'Failed to load order details';
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Order not found';
        } else if (err.response.status === 403) {
          errorMessage = 'You do not have permission to view this order';
        } else if (err.response.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
      setError(errorMessage);
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
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm order');
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this order?')) return;
    try {
      await orderApi.rejectOrder(id);
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject order');
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Are you sure you want to complete this order?')) return;
    try {
      await orderApi.completeOrder(id);
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete order');
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="container">
        <button onClick={() => navigate('/farmer/orders')} className="btn btn-secondary mb-2">
          ← Back to Orders
        </button>
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container">
        <button onClick={() => navigate('/farmer/orders')} className="btn btn-secondary mb-2">
          ← Back to Orders
        </button>
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/farmer/orders')} className="btn btn-secondary mb-2">
        ← Back
      </button>

      <div className="card">
        <div className="flex-between mb-2">
          <h2>Order #{order.id}</h2>
          <span className={`badge badge-${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>

        <hr />

        <h3>Buyer Information</h3>
        <p><strong>Name:</strong> {order.buyerName || "Not Provided"}</p>
        <p><strong>Phone:</strong> {order.buyerPhone || "Not Provided"}</p>
        <p><strong>State:</strong> {order.buyerState || "Not Provided"}</p>
        <p><strong>District:</strong> {order.buyerDistrict || "Not Provided"}</p>
        <p><strong>Email:</strong> {order.buyerPhone || "Not Provided"}</p>
        <p><strong>Address:</strong> {order.buyerAddress || "Not Provided"}</p>

        <hr />

        <h3>Order Items</h3>
        <table style={{ width: '100%', marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map(item => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.priceEach)}</td>
                <td>{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <h3>Total: {formatCurrency(order.totalAmount)}</h3>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
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