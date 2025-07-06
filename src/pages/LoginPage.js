import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import backgroundVideo from '../assets/videos/city-drive.mp4';

function LoginPage() {
  const [activeTab, setActiveTab] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (activeTab === 'user') {
      if (username && password) {
        // For demo, just use any username/password
        // In a real app, you would validate credentials against a backend
        localStorage.setItem('user', JSON.stringify({ username, role: 'user' }));
        navigate('/dashboard');
      } else {
        setError('Please enter both username and password');
      }
    } else {
      setError(`${activeTab.toUpperCase()} login not yet implemented`);
    }
  };

  return (
    <div className="login-page">
      <video autoPlay muted loop className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      
      <div className="overlay"></div>
      
      <div className="login-container">
        <h1 className="login-title">HINDCHARGE</h1>
        <h2 className="login-subtitle">LOGIN</h2>
        
        <div className="login-tabs">
          <button 
            className={`login-tab ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            USER
          </button>
          <button 
            className={`login-tab ${activeTab === 'owner' ? 'active' : ''}`}
            onClick={() => setActiveTab('owner')}
          >
            STATION OWNER
          </button>
          <button 
            className={`login-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            ADMIN
          </button>
        </div>
        
        <form className="login-form" onSubmit={handleLogin}>
          {activeTab === 'user' && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                />
              </div>
            </>
          )}
          
          {activeTab === 'owner' && (
            <>
              <div className="form-group">
                <input type="text" placeholder="Station Owner ID" disabled className="login-input" />
              </div>
              <div className="form-group">
                <input type="password" placeholder="Password" disabled className="login-input" />
              </div>
            </>
          )}
          
          {activeTab === 'admin' && (
            <>
              <div className="form-group">
                <input type="text" placeholder="Admin Username" disabled className="login-input" />
              </div>
              <div className="form-group">
                <input type="password" placeholder="Password" disabled className="login-input" />
              </div>
            </>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">LOGIN</button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          <Link to="/" className="back-to-home">BACK TO HOME</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
