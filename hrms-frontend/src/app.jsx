import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './components/home/auth_page';
import HRDashboard from './components/dashboard/HRDashboard';
import UserDashboard from './components/dashboard/UserDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
