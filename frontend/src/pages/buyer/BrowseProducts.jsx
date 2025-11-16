import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { orderApi } from '../../api/orderApi';
import ProductCard from '../../components/product/ProductCard';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatCurrency } from '../../utils/helpers';
import './BrowseProducts.css';

const BrowseProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        price: product.price,
        unit: product.unit,
        farmerId: product.farmerId,
        farmerName: product.farmerName,
        quantity: 1,
        maxQty: product.qtyAvailable
      }]);
    }
    setShowCart(true);
  };

  const updateQuantity = (productId, newQuantity) => {
    const item = cart.find(i => i.productId === productId);
    if (newQuantity > item.maxQty) {
      alert(`Maximum available quantity is ${item.maxQty} ${item.unit}`);
      return;
    }
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const groupCartByFarmer = () => {
    const grouped = {};
    cart.forEach(item => {
      if (!grouped[item.farmerId]) {
        grouped[item.farmerId] = {
          farmerId: item.farmerId,
          farmerName: item.farmerName,
          items: []
        };
      }
      grouped[item.farmerId].items.push(item);
    });
    return Object.values(grouped);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const farmerGroups = groupCartByFarmer();
    
    try {
      for (const group of farmerGroups) {
        const orderData = {
          farmerId: group.farmerId,
          items: group.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        };
        await orderApi.createOrder(orderData);
      }
      
      alert('Orders placed successfully!');
      setCart([]);
      setShowCart(false);
      navigate('/buyer/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Browse Products</h1>
        <button 
          onClick={() => setShowCart(!showCart)} 
          className="btn btn-primary"
        >
          🛒 Cart ({cart.length})
        </button>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {showCart && cart.length > 0 && (
        <div className="cart-panel card">
          <h3>Shopping Cart</h3>
          {cart.map(item => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-details">
                <strong>{item.productName}</strong>
                <p>{item.farmerName}</p>
                <p>{formatCurrency(item.price)} / {item.unit}</p>
              </div>
              <div className="cart-item-actions">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, parseFloat(e.target.value))}
                  min="0.1"
                  step="0.1"
                  max={item.maxQty}
                  className="quantity-input"
                />
                <span>{formatCurrency(item.price * item.quantity)}</span>
                <button onClick={() => removeFromCart(item.productId)} className="btn btn-danger btn-sm">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total: {formatCurrency(getCartTotal())}</strong>
          </div>
          <button onClick={handleCheckout} className="btn btn-primary">
            Place Order
          </button>
        </div>
      )}

      <div className="products-grid">
        {products.length === 0 ? (
          <p>No products available at the moment.</p>
        ) : (
          products.map(product => (
            <div key={product.id}>
              <ProductCard product={product} showActions={false} />
              <button 
                onClick={() => addToCart(product)} 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '10px' }}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseProducts;