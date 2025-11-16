import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../common/ErrorMessage';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);
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
      <div className="text">Login</div>
      <form onSubmit={handleSubmit}>
        <ErrorMessage message={error} onClose={() => setError('')} />
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
          />
          <label>Password</label>
        </div>

        <div className="forgot-pass">
          <Link to="#">Forgot Password?</Link>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="sign-up">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
