import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import ProductCard from '../../components/product/ProductCard';
import Loading from '../../components/common/Loading';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getMyProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    navigate(`/farmer/products/edit/${product.id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productApi.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleToggle = async (product) => {
    try {
      await productApi.toggleProductStatus(product.id);
      fetchProducts();
    } catch (err) {
      alert('Failed to update product status');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container">
      <div className="flex-between mb-2">
        <h1>My Products</h1>
        <Link to="/farmer/products/add" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {products.length === 0 ? (
        <div className="card text-center">
          <p>You haven't added any products yet.</p>
          <Link to="/farmer/products/add" className="btn btn-primary mt-2">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
