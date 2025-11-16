import React, { useState, useEffect } from 'react';
import ErrorMessage from '../common/ErrorMessage';

const ProductForm = ({ product, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    qtyAvailable: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        unit: product.unit || 'kg',
        qtyAvailable: product.qtyAvailable || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    if (parseFloat(formData.qtyAvailable) < 0) {
      setError('Quantity cannot be negative');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
      
      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="form-group">
        <label>Product Name *</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Price *</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          min="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label>Unit</label>
        <select
          name="unit"
          className="form-control"
          value={formData.unit}
          onChange={handleChange}
        >
          <option value="kg">Kilogram (kg)</option>
          <option value="g">Gram (g)</option>
          <option value="l">Liter (l)</option>
          <option value="piece">Piece</option>
          <option value="dozen">Dozen</option>
        </select>
      </div>

      <div className="form-group">
        <label>Quantity Available *</label>
        <input
          type="number"
          name="qtyAvailable"
          className="form-control"
          value={formData.qtyAvailable}
          onChange={handleChange}
          step="0.1"
          min="0"
          required
        />
      </div>

      <div className="flex" style={{ gap: '10px' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;