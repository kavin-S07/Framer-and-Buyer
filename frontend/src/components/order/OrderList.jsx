import React from 'react';
import OrderCard from './OrderCard';

const OrderList = ({ orders, userRole }) => {
  if (!orders || orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="order-list">
      {orders.map(order => (
        <OrderCard key={order.id} order={order} userRole={userRole} />
      ))}
    </div>
  );
};

export default OrderList;