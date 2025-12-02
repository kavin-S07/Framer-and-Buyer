import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../utils/constants';
import './OrderCard.css';
import { orderApi } from '../../api/orderApi';

const OrderCard = ({ order, userRole, onUpdate }) => {
  const isFarmer = userRole === 'FARMER';

  // ---------------------------
  // CONFIRM ORDER (Farmer only)
  // ---------------------------
  const handleConfirm = async () => {
    if (window.confirm('Are you sure you want to confirm this order?')) {
      try {
        await orderApi.confirmOrder(order.id);
        onUpdate(); // refresh list
      } catch (error) {
        console.error('Failed to confirm order', error);
        alert('Failed to confirm order. Please try again.');
      }
    }
  };

  // ---------------------------
  // COMPLETE ORDER (Farmer only)
  // ---------------------------
  const handleComplete = async () => {
    if (window.confirm('Are you sure you want to complete this order?')) {
      try {
        await orderApi.completeOrder(order.id);
        onUpdate(); // refresh list
      } catch (error) {
        console.error('Failed to complete order', error);
        alert('Failed to complete order. Please try again.');
      }
    }
  };

  return (
    <div className="order-card">
      {/* HEADER */}
      <div className="order-header">
        <div>
          <h4>Order #{order.id}</h4>
          <p className="order-date">{formatDate(order.createdAt)}</p>
        </div>

        <span className={`badge badge-${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* BODY */}
      <div className="order-body">
        {isFarmer ? (
          <div className="order-info">
            <p><strong>Buyer:</strong> {order.buyerName}</p>
            <p><strong>Phone:</strong> {order.buyerPhone}</p>
            <p><strong>Address:</strong> {order.buyerAddress}</p>
          </div>
        ) : (
          <div className="order-info">
            <p><strong>Farmer:</strong> {order.farmerName}</p>
          </div>
        )}

        <div className="order-items">
          <p><strong>Items:</strong></p>
          {order.items.map((item) => (
            <p key={item.id} className="order-item">
              • {item.productName} - {item.quantity} × {formatCurrency(item.priceEach)}
            </p>
          ))}
        </div>

        <div className="order-total">
          <strong>Total: {formatCurrency(order.totalAmount)}</strong>
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="order-footer">
        <Link
          to={isFarmer ? `/farmer/orders/${order.id}` : `/buyer/orders/${order.id}`}
          className="btn btn-primary btn-sm"
        >
          View Details
        </Link>

        {/* 🔵 SHOW CONFIRM BUTTON (Only for Farmer, only when PENDING) */}
        {isFarmer && order.status === 'PENDING' && (
          <button onClick={handleConfirm} className="btn btn-success btn-sm">
            Confirm
          </button>
        )}

        {/* 🟢 SHOW COMPLETE BUTTON (Only for Farmer, only when CONFIRMED) */}
        {isFarmer && order.status === 'CONFIRMED' && (
          <button onClick={handleComplete} className="btn btn-success btn-sm">
            Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
