import React from 'react';  
import { useNavigate } from 'react-router-dom';
import '../../Styling_files/HRDashboard.css';

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
  <aside className="sidebar">Zenbeta HRMS for HR</aside>
  <main className="content">Main content</main>
</div>
  );
};

export default HRDashboard;
