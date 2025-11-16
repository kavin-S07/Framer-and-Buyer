import React, { useState, useEffect } from 'react';
import { orderApi } from '../../api/orderApi';
import OrderCard from '../../components/order/OrderCard';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/helpers';

const SalesHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalesHistory();
  }, []);

  const fetchSalesHistory = async () => {
    try {
      const response = await orderApi.getSalesHistory();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load sales history');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);

  if (loading) return <Loading />;

  return (
    <div className="container">
      <h1>Sales History</h1>

      <div className="card mb-2">
        <div className="flex-between">
          <div>
            <h3>Total Completed Sales</h3>
            <p>{orders.length} orders</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3>Total Revenue</h3>
            <p style={{ fontSize: '1.5rem', color: '#28a745', fontWeight: 'bold' }}>
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="card text-center">
          <p>No completed sales yet</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} userRole="FARMER" />
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesHistory;