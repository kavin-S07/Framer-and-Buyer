// ProductDetail.jsx
import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import './ProductDetail.css';

const ProductDetail = ({ product, onAddToCart, onEdit, onDelete }) => {
  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="product-detail-card">
      <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} className="product-detail-image" />
      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <p className="product-detail-description">{product.description}</p>
        <p className="product-detail-price">{formatCurrency(product.price)}</p>
        <div className="product-detail-actions">
          {onAddToCart && <button onClick={() => onAddToCart(product)} className="btn btn-primary">Add to Cart</button>}
          {onEdit && <button onClick={() => onEdit(product.id)} className="btn btn-secondary">Edit</button>}
          {onDelete && <button onClick={() => onDelete(product.id)} className="btn btn-danger">Delete</button>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;