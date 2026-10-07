import React from 'react';  
import { useNavigate } from 'react-router-dom';
import '../../Styling_files/HRDashboard.css';
import '../../demo_contents/forhr';
import Sidebar from './sidebar';


const HRDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
  <div className="layout">
    <Sidebar user={user} onLogout={handleLogout} />
    <main className="content">Main content</main>
  </div>
  );
};

export default HRDashboard;
