import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../utils/constants';
import './OrderCard.css';

const OrderCard = ({ order, userRole }) => {
  const isFarmer = userRole === 'FARMER';

  return (
    <div className="order-card">
      <div className="order-header">
        <div>
          <h4>Order #{order.id}</h4>
          <p className="order-date">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`badge badge-${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

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

      <div className="order-footer">
        <Link
          to={isFarmer ? `/farmer/orders/${order.id}` : `/buyer/orders/${order.id}`}
          className="btn btn-primary btn-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
