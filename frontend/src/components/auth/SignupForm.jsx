import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'BUYER',
    phone: '',
    address: '',
    state: '',
    district: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signup(formData);
    setLoading(false);

    if (result.success) {
      const redirectPath = result.user.role === 'FARMER' ? '/farmer/dashboard' : '/buyer/dashboard';
      navigate(redirectPath);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign Up</h2>
        
        <ErrorMessage message={error} onClose={() => setError('')} />

        <div className="form-group">
          <label>Full Name</label>
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
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>I am a</label>
          <select
            name="role"
            className="form-control"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="BUYER">Buyer</option>
            <option value="FARMER">Farmer</option>
          </select>
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            className="form-control"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>District</label>
          <input
            type="text"
            name="district"
            className="form-control"
            value={formData.district}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="text-center mt-2">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;