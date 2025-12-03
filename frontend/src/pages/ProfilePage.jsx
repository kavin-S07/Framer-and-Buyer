import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    district: '',
    role: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userApi.getCurrentUser();
      const userData = response.data;
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        state: userData.state || '',
        district: userData.district || '',
        role: userData.role || ''
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await userApi.updateProfile(formData);
      setSuccess('Profile updated successfully!');

      // Update local storage user data
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);

    try {
      // Note: You'll need to create this endpoint in your backend
      alert('Password change functionality requires backend implementation');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Back
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Information Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Personal Information</h2>
            <span className="role-badge">{formData.role}</span>
          </div>

          <ErrorMessage message={error} onClose={() => setError('')} />
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
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
                  disabled
                  style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                />
                <small style={{ color: '#666' }}>Email cannot be changed</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
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
            </div>

            <div className="form-row">
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

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Password Change Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h2>Security Settings</h2>
          </div>

          {!showPasswordForm ? (
            <div>
              <p style={{ marginBottom: '15px', color: '#666' }}>
                Keep your account secure by using a strong password
              </p>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn btn-secondary"
              >
                Change Password
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <label>Current Password *</label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password *</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Danger Zone */}
        <div className="profile-card danger-zone">
          <div className="profile-card-header">
            <h2>Danger Zone</h2>
          </div>
          <p style={{ marginBottom: '15px', color: '#666' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                alert('Account deletion requires backend implementation');
              }
            }}
            className="btn btn-danger"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;