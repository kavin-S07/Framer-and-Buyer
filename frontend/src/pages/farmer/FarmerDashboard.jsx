import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/helpers';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await orderApi.getFarmerStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container">
      <div className="loading-container">
        <Loading />
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Farmer Dashboard</h1>
        <Link to="/farmer/products/add" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats?.totalProducts || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>{stats?.totalOrders || 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats?.pendingOrders || 0}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats?.totalRevenue || 0)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2 style={{ gridColumn: '1 / -1', marginBottom: '10px', color: '#333' }}>Quick Actions</h2>
        <Link to="/farmer/products" className="action-card">
          <h3>Manage Products</h3>
          <p>View, edit, and add your products</p>
        </Link>
        <Link to="/farmer/orders" className="action-card">
          <h3>View Orders</h3>
          <p>Manage incoming orders</p>
        </Link>
        <Link to="/farmer/sales" className="action-card">
          <h3>Sales History</h3>
          <p>View completed sales</p>
        </Link>
      </div>
    </div>
  );
};

export default FarmerDashboard;