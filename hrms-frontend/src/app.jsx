import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './components/home/auth_page';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
