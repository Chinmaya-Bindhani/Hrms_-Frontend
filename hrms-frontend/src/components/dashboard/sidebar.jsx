import '../../Styling_files/HRDashboard.css';

const Sidebar = ({ user, onLogout }) => (
  <aside className="sidebar">
    <div className="logo">Zenbeta<span>HRMS</span></div>
    <div className="org">Your Company · Hyderabad</div>

    <nav className="nav">
      <button className="active">Dashboard</button>
      <button>Employees</button>
      <button>Attendance</button>
      <button>Leave requests</button>
    </nav>

    <div className="user-box">
      <button className="logout" onClick={onLogout}>Log out</button>
    </div>
  </aside>
);

export default Sidebar;