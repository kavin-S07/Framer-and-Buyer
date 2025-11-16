import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isFarmer, isBuyer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <div className="brand-container">
              <img src="/logo.png" alt="Farmers Market" className="brand-logo" />
              <span className="brand-text">Farmers Market</span>
            </div>
          </Link>

          <div className="navbar-menu">
            {!isAuthenticated ? (
              <>
                <Link to="/" className={isActiveLink('/')}>Home</Link>
                <Link to="/products" className={isActiveLink('/products')}>Products</Link>
                <Link to="/login" className={isActiveLink('/login')}>Login</Link>
                <Link to="/signup" className="btn btn-primary nav-btn">Sign Up</Link>
              </>
            ) : (
              <>
                {isFarmer && (
                  <>
                    <Link to="/farmer/dashboard" className={isActiveLink('/farmer/dashboard')}>
                      Dashboard
                    </Link>
                    <Link to="/farmer/products" className={isActiveLink('/farmer/products')}>
                      My Products
                    </Link>
                    <Link to="/farmer/orders" className={isActiveLink('/farmer/orders')}>
                      Orders
                    </Link>
                  </>
                )}

                {isBuyer && (
                  <>
                    <Link to="/buyer/dashboard" className={isActiveLink('/buyer/dashboard')}>
                      Dashboard
                    </Link>
                    <Link to="/products" className={isActiveLink('/products')}>
                      Browse Products
                    </Link>
                    <Link to="/buyer/orders" className={isActiveLink('/buyer/orders')}>
                      My Orders
                    </Link>
                  </>
                )}

                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-icon">👤</span>
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role">{user?.role}</span>
                  </div>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm logout-btn">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;