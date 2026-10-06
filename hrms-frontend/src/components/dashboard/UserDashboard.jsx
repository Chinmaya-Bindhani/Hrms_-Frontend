import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './Styling_files/index.css';
import '../../Styling_files/USERDashboard.css';
import '../../Styling_files/index.css';
import Sidebar from './sidebar';



const UserDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
<div className="layout">
  
<aside className="sidebar">
  <div className="logo">Welcome<span>User</span></div>
  <div className="org">Zenbeta · Hyderabad</div>

  <nav className="nav">
    <button className="active">Dashboard</button>
    <button>Attendance</button>
    <button> Apply for Leave</button>
  </nav>

  <div className="user-box">
    <button className="logout" onClick={handleLogout}>Log out</button>
  </div>
</aside>


  <main className="content">Main content</main>
</div>
  );
};

export default UserDashboard;
