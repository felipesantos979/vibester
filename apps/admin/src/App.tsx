import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Posts from './pages/Posts';
import Promotions from './pages/Promotions';
import Analytics from './pages/Analytics';
import VipList from './pages/VipList';
import Settings from './pages/Settings';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/events" element={<DashboardLayout />}>
          <Route index element={<Events />} />
        </Route>
        <Route path="/posts" element={<DashboardLayout />}>
          <Route index element={<Posts />} />
        </Route>
        <Route path="/promotions" element={<DashboardLayout />}>
          <Route index element={<Promotions />} />
        </Route>
        <Route path="/analytics" element={<DashboardLayout />}>
          <Route index element={<Analytics />} />
        </Route>
        <Route path="/vip" element={<DashboardLayout />}>
          <Route index element={<VipList />} />
        </Route>
        <Route path="/settings" element={<DashboardLayout />}>
          <Route index element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
