import { useState } from 'react';
export default function AuthPage() {
  const [role, setRole] = useState('Employee');

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
          Built around your people. Designed for your workday.
        </div>
      </div>

      {/* Right */}
      <div className="login-right">
        <div className="login-form-container">
          <h2 className="form-title">Welcome to PeopleDesk</h2>
          <br/>
          <form onSubmit={(e) => e.preventDefault()}>
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
              <label htmlFor="email">Work email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="aditi.sharma@sahyadrilabs.example" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input 
                  type="password" 
                  id="password" 
                  placeholder="••••••••••••" 
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

            <button type="submit" className="submit-btn">
              Sign in as {role}
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
          PeopleDesk · Sahyadri Labs
        </div>
      </div>
    </div>
  );
}