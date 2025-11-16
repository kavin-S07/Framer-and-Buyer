import React from 'react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';

const OrderDetail = ({ order, userRole }) => {
  if (!order) {
    return <p>No order details available.</p>;
  }

  const isFarmer = userRole === 'FARMER';

  return (
    <div className="card">
      <div className="flex-between mb-2">
        <h2>Order #{order.id}</h2>
        <span className={`badge badge-${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>

      <hr />

      <h3>{isFarmer ? 'Buyer Information' : 'Farmer Information'}</h3>
      <p><strong>Name:</strong> {isFarmer ? order.buyerName : order.farmerName}</p>

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

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <h3>Total: {formatCurrency(order.totalAmount)}</h3>
      </div>
    </div>
  );
};

export default OrderDetail;