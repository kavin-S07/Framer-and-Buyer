import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import ProductForm from '../../components/product/ProductForm';
import './Addproduct.css';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await productApi.createProduct(formData);
      alert('Product added successfully!');
      navigate('/farmer/products');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Add New Product</h1>
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/farmer/products')}
        loading={loading}
      />
    </div>
  );
};

export default AddProduct;
