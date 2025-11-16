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
    <div className="content">
      <div className="text">Sign Up</div>
      <form onSubmit={handleSubmit}>
        <ErrorMessage message={error} onClose={() => setError('')} />

        <div className="field">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Full Name</label>
        </div>

        <div className="field">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Email</label>
        </div>

        <div className="field">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
          <label>Password</label>
        </div>

        <div className="field">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="BUYER">Buyer</option>
            <option value="FARMER">Farmer</option>
          </select>
        </div>

        <div className="field">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <label>Phone</label>
        </div>

        <div className="field">
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
          <label>State</label>
        </div>

        <div className="field">
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          />
          <label>District</label>
        </div>

        <div className="field">
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <label>Address</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <div className="sign-up">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
