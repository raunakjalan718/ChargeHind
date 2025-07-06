import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">USER PROFILE</h1>
        <Link to="/dashboard" className="dashboard-link">DASHBOARD</Link>
      </div>
      
      <div className="profile-main">
        <div className="profile-user">
          <h2 className="username">{user.username}</h2>
        </div>
        
        <div className="profile-navigation">
          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} 
              onClick={() => setActiveTab('profile')}
            >
              Profile Information
            </button>
            <button 
              className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`} 
              onClick={() => setActiveTab('saved')}
            >
              Saved Stations
            </button>
            <button 
              className={`tab-button ${activeTab === 'booking' ? 'active' : ''}`} 
              onClick={() => setActiveTab('booking')}
            >
              Booking History
            </button>
            <button 
              className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`} 
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
          </div>
          <button onClick={handleLogout} className="logout-button">LOGOUT</button>
        </div>
        
        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="content-section">
              <h2 className="section-title">PROFILE INFORMATION</h2>
              
              <div className="profile-field">
                <div className="field-label">Username</div>
                <div className="field-value">{user.username}</div>
              </div>
              
              <div className="profile-field">
                <div className="field-label">Email</div>
                <div className="field-value">user@example.com</div>
              </div>
              
              <div className="profile-field">
                <div className="field-label">Role</div>
                <div className="field-value">{user.role}</div>
              </div>
              
              <div className="profile-field">
                <div className="field-label">Member Since</div>
                <div className="field-value">July 6, 2023</div>
              </div>
              
              <button className="edit-button">Edit Profile</button>
            </div>
          )}
          
          {activeTab === 'saved' && (
            <div className="content-section">
              <h2 className="section-title">SAVED STATIONS</h2>
              <div className="empty-state">You haven't saved any stations yet.</div>
            </div>
          )}
          
          {activeTab === 'booking' && (
            <div className="content-section">
              <h2 className="section-title">BOOKING HISTORY</h2>
              <div className="empty-state">You don't have any booking history yet.</div>
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div className="content-section">
              <h2 className="section-title">PREFERENCES</h2>
              <div className="preferences-list">
                <div className="preference-item">
                  <input type="checkbox" id="fast-charging" />
                  <label htmlFor="fast-charging">Show only fast charging stations</label>
                </div>
                <div className="preference-item">
                  <input type="checkbox" id="home-location" />
                  <label htmlFor="home-location">Default to my home location</label>
                </div>
                <div className="preference-item">
                  <input type="checkbox" id="notifications" />
                  <label htmlFor="notifications">Receive booking notifications</label>
                </div>
                <div className="preference-item">
                  <input type="checkbox" id="newsletter" />
                  <label htmlFor="newsletter">Subscribe to newsletter</label>
                </div>
              </div>
              <button className="save-button">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
