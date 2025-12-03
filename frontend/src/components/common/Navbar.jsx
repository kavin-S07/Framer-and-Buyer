import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isFarmer, isBuyer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  const isActiveRoot = (path) => {
    return location.pathname.startsWith(path) ? 'nav-link active' : 'nav-link';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current &&
          !mobileMenuRef.current.contains(event.target) &&
          !event.target.closest('.mobile-menu-btn')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <div className="brand-container">
              <img src="/logo.png" alt="Farmers Market" className="brand-logo" />
              <span className="brand-text">FarmFresh</span>
            </div>
          </Link>

          <button
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="menu-line"></span>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
          </button>

          <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`} ref={mobileMenuRef}>
            {!isAuthenticated ? (
              <>
                <Link to="/" className={isActiveLink('/')} onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/login" className="nav-link login-link" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="nav-btn" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {isFarmer && (
                  <>
                    <Link to="/farmer/dashboard" className={isActiveRoot('/farmer/dashboard')} onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/farmer/products" className={isActiveRoot('/farmer/products')} onClick={() => setMobileMenuOpen(false)}>
                      My Products
                    </Link>
                    <Link to="/farmer/orders" className={isActiveRoot('/farmer/orders')} onClick={() => setMobileMenuOpen(false)}>
                      Orders
                    </Link>
                    <Link to="/farmer/sales" className={isActiveRoot('/farmer/sales')} onClick={() => setMobileMenuOpen(false)}>
                      Sales
                    </Link>
                  </>
                )}

                {isBuyer && (
                  <>
                    <Link to="/buyer/dashboard" className={isActiveRoot('/buyer/dashboard')} onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/products" className={isActiveLink('/products')} onClick={() => setMobileMenuOpen(false)}>
                      Browse
                    </Link>
                    <Link to="/buyer/orders" className={isActiveRoot('/buyer/orders')} onClick={() => setMobileMenuOpen(false)}>
                      My Orders
                    </Link>
                  </>
                )}

                <div className="user-menu" ref={dropdownRef}>
                  <div
                    className="user-info"
                    onClick={() => setShowDropdown(!showDropdown)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setShowDropdown(!showDropdown);
                      }
                    }}
                  >
                    <span className="user-avatar">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    <div className="user-details">
                      <span className="user-name">{user?.name || 'User'}</span>
                      <span className={`user-role ${isFarmer ? 'farmer-role' : 'buyer-role'}`}>
                        {user?.role || 'Member'}
                      </span>
                    </div>
                    <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
                  </div>

                  <div className={`user-dropdown ${showDropdown ? 'show' : ''}`}>
                    <div className="dropdown-header">
                      <span className="dropdown-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                      <div className="dropdown-user-info">
                        <span className="dropdown-name">{user?.name || 'User'}</span>
                        <span className="dropdown-email">{user?.email || ''}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => {
                        setShowDropdown(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <span className="dropdown-icon">👤</span>
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to={isFarmer ? '/farmer/dashboard' : '/buyer/dashboard'}
                      className="dropdown-item"
                      onClick={() => {
                        setShowDropdown(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <span className="dropdown-icon">📊</span>
                      <span>Dashboard</span>
                    </Link>
                    {isFarmer && (
                      <Link
                        to="/farmer/sales"
                        className="dropdown-item"
                        onClick={() => {
                          setShowDropdown(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <span className="dropdown-icon">💰</span>
                        <span>Sales History</span>
                      </Link>
                    )}

                    <div className="dropdown-divider"></div>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      <span className="dropdown-icon">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
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