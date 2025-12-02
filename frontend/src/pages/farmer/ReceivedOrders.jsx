import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/helpers';

const ReceivedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderApi.getFarmerOrders(filter || null);
      setOrders(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleConfirmOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to confirm this order?')) {
      return;
    }

    setProcessingOrderId(orderId);
    try {
      await orderApi.confirmOrder(orderId);
      // Refresh orders after successful update
      await fetchOrders();
    } catch (err) {
      console.error('Error confirming order:', err);
      alert(err.response?.data?.message || 'Failed to confirm order. Please try again.');
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleRejectOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to reject this order? This action cannot be undone.')) {
      return;
    }

    setProcessingOrderId(orderId);
    try {
      await orderApi.rejectOrder(orderId);
      // Refresh orders after successful update
      await fetchOrders();
    } catch (err) {
      console.error('Error rejecting order:', err);
      alert(err.response?.data?.message || 'Failed to reject order. Please try again.');
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to mark this order as completed?')) {
      return;
    }

    setProcessingOrderId(orderId);
    try {
      await orderApi.completeOrder(orderId);
      // Refresh orders after successful update
      await fetchOrders();
    } catch (err) {
      console.error('Error completing order:', err);
      alert(err.response?.data?.message || 'Failed to complete order. Please try again.');
    } finally {
      setProcessingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px' }}>
        <Loading />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: '#333' }}>
        Received Orders
      </h1>

      {/* Filter Buttons */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('')}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            backgroundColor: filter === '' ? '#28a745' : '#6c757d',
            color: 'white',
            transition: 'all 0.3s ease'
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            backgroundColor: filter === 'PENDING' ? '#28a745' : '#6c757d',
            color: 'white',
            transition: 'all 0.3s ease'
          }}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('CONFIRMED')}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            backgroundColor: filter === 'CONFIRMED' ? '#28a745' : '#6c757d',
            color: 'white',
            transition: 'all 0.3s ease'
          }}
        >
          Confirmed
        </button>
        <button
          onClick={() => setFilter('COMPLETED')}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            backgroundColor: filter === 'COMPLETED' ? '#28a745' : '#6c757d',
            color: 'white',
            transition: 'all 0.3s ease'
          }}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('REJECTED')}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            backgroundColor: filter === 'REJECTED' ? '#28a745' : '#6c757d',
            color: 'white',
            transition: 'all 0.3s ease'
          }}
        >
          Rejected
        </button>
      </div>

      {error && (
        <div style={{
          background: '#fee',
          border: '1px solid #fcc',
          color: '#c33',
          padding: '16px 20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '60px 20px',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #e0e0e0'
        }}>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>No orders found</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {orders.map(order => (
            <div
              key={order.id}
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
            >
              {/* Order Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#333' }}>
                  Order #{order.id}
                </h3>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  backgroundColor:
                    order.status === 'COMPLETED' ? '#d4edda' :
                    order.status === 'CONFIRMED' ? '#d1ecf1' :
                    order.status === 'PENDING' ? '#fff3cd' :
                    order.status === 'REJECTED' ? '#f8d7da' : '#e2e3e5',
                  color:
                    order.status === 'COMPLETED' ? '#155724' :
                    order.status === 'CONFIRMED' ? '#0c5460' :
                    order.status === 'PENDING' ? '#856404' :
                    order.status === 'REJECTED' ? '#721c24' : '#383d41'
                }}>
                  {order.status}
                </span>
              </div>

              <p style={{
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '15px'
              }}>
                {formatDate(order.createdAt)}
              </p>

              {/* Buyer Info */}
              <div style={{
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e0e0e0'
              }}>
                <p style={{ margin: '5px 0', color: '#333' }}>
                  <strong>Buyer:</strong> {order.buyerName || 'Not Provided'}
                </p>
                <p style={{ margin: '5px 0', color: '#333' }}>
                  <strong>Phone:</strong> {order.buyerPhone || 'Not Provided'}
                </p>
                <p style={{ margin: '5px 0', color: '#333' }}>
                  <strong>Address:</strong> {order.buyerAddress || 'Not Provided'}
                </p>
              </div>

              {/* Items */}
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{
                  fontSize: '0.95rem',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  Items:
                </h4>
                <ul style={{
                  margin: 0,
                  paddingLeft: '20px',
                  listStyleType: 'disc'
                }}>
                  {order.items.map(item => (
                    <li key={item.id} style={{
                      marginBottom: '5px',
                      color: '#555'
                    }}>
                      {item.productName} - {item.quantity} × {formatCurrency(item.priceEach)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Total */}
              <div style={{
                marginBottom: '20px',
                fontSize: '1.2rem',
                fontWeight: '700',
                color: '#28a745',
                textAlign: 'right'
              }}>
                Total: {formatCurrency(order.totalAmount)}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                {/* Confirm and Reject Buttons - Show only for PENDING orders */}
                {order.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleConfirmOrder(order.id)}
                      disabled={processingOrderId === order.id}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: processingOrderId === order.id ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: processingOrderId === order.id ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s ease',
                        opacity: processingOrderId === order.id ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (processingOrderId !== order.id) {
                          e.currentTarget.style.backgroundColor = '#218838';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (processingOrderId !== order.id) {
                          e.currentTarget.style.backgroundColor = '#28a745';
                        }
                      }}
                    >
                      {processingOrderId === order.id ? 'Processing...' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => handleRejectOrder(order.id)}
                      disabled={processingOrderId === order.id}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: processingOrderId === order.id ? '#6c757d' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: processingOrderId === order.id ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s ease',
                        opacity: processingOrderId === order.id ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (processingOrderId !== order.id) {
                          e.currentTarget.style.backgroundColor = '#c82333';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (processingOrderId !== order.id) {
                          e.currentTarget.style.backgroundColor = '#dc3545';
                        }
                      }}
                    >
                      {processingOrderId === order.id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                )}

                {/* Complete Button - Show only for CONFIRMED orders */}
                {order.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCompleteOrder(order.id)}
                    disabled={processingOrderId === order.id}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: processingOrderId === order.id ? '#6c757d' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: processingOrderId === order.id ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.3s ease',
                      opacity: processingOrderId === order.id ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (processingOrderId !== order.id) {
                        e.currentTarget.style.backgroundColor = '#0056b3';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (processingOrderId !== order.id) {
                        e.currentTarget.style.backgroundColor = '#007bff';
                      }
                    }}
                  >
                    {processingOrderId === order.id ? 'Processing...' : 'Complete Order'}
                  </button>
                )}

                {/* View Details Button - Always show */}
                <button
                  onClick={() => navigate(`/farmer/orders/${order.id}`)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedOrders;