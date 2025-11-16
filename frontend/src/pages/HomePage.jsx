import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, isFarmer } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>Welcome to Farmers Market</h1>
          <p className="hero-subtitle">
            Connecting farmers directly with buyers. Fresh produce, fair prices, no middlemen.
          </p>
          <div className="hero-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/products" className="btn btn-secondary btn-lg">
                  Browse Products
                </Link>
              </>
            ) : (
              <Link
                to={isFarmer ? '/farmer/dashboard' : '/buyer/dashboard'}
                className="btn btn-primary btn-lg"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="text-center">Why Choose Farmers Market?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌾</div>
              <h3>Fresh Produce</h3>
              <p>Get the freshest fruits, vegetables, and farm products directly from local farmers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Fair Prices</h3>
              <p>No middlemen means better prices for both farmers and buyers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Direct Connection</h3>
              <p>Build relationships directly with farmers and know where your food comes from.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy to Use</h3>
              <p>Simple platform to list products, place orders, and manage transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="text-center">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your account as a farmer or buyer in just a few clicks.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>List or Browse</h3>
              <p>Farmers list their products. Buyers browse available fresh produce.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Order & Connect</h3>
              <p>Place orders directly. Get contact information to arrange delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="text-center">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of farmers and buyers already using Farmers Market</p>
            {!isAuthenticated && (
              <Link to="/signup" className="btn btn-primary btn-lg">
                Sign Up Now
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;