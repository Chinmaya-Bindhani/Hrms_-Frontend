import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [role, setRole] = useState('Employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

   
    setTimeout(() => {
      if (role === 'HR' && email === 'hr@example.com' && password === 'password123') {
        localStorage.setItem('token', 'mock-hr-token');
        localStorage.setItem('user', JSON.stringify({ name: 'HR Manager', role: 'HR' }));
        navigate('/hr-dashboard');
      } else if (role === 'Employee' && email === 'user@example.com' && password === 'password123') {
        localStorage.setItem('token', 'mock-user-token');
        localStorage.setItem('user', JSON.stringify({ name: 'Employee', role: 'USER' }));
        navigate('/user-dashboard');
      } else {
        setError('Invalid email or password for the selected role');
      }
      setIsLoading(false);
    }, 500); 

  };
  
  return (
    <div className="login-layout">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="logo-container">
            <span className="logo-text-white">Zenbeta</span><span className="logo-text-teal"></span>
          </div>

          <div className="hero-section">
            <p className="hero-subtitle">HRMS SYSTEM </p>
          </div>

        </div>

        <div className="login-left-footer">
         Zenbeta Technologies Pvt. Ltd
        </div>
      </div>

      {/* Right */}
      <div className="login-right">
        <div className="login-form-container">
          <h2 className="form-title">Welcome to PeopleDesk</h2>
          <br/>
          <form onSubmit={handleLogin}>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <div className="form-group">
              <div className="role-selector">
                <button 
                  type="button" 
                  className={`role-btn ${role === 'Employee' ? 'active' : ''}`}
                  onClick={() => setRole('Employee')}
                >
                  Employee
                </button>
                <button 
                  type="button" 
                  className={`role-btn ${role === 'HR' ? 'active' : ''}`}
                  onClick={() => setRole('HR')}
                >
                  HR
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email / Username</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hr@example.com" 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123" 
                  required
                />
                <button type="button" className="password-toggle">
                  Show
                </button>
              </div>
            </div>

            <div className="form-row form-options">
              <label className="checkbox-container">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : `Sign in as ${role}`}
            </button>
          </form>

          <div className="form-footer">
           {/* in future i will give the texts */}
            <div className="secure-badge">
              {/* in future i will give the texts */}
            </div>
          </div>
        </div>
        
        <div className="login-right-footer">
          Chinmaya Bindhani
        </div>
      </div>
    </div>
  );
}