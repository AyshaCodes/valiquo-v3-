import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Scan from './pages/Scan';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardHome from './pages/dashboard/DashboardHome';
import Coach from './pages/dashboard/Coach';
import Analyses from './pages/dashboard/Analyses';
import Rapports from './pages/dashboard/Rapports';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="coach" element={<Coach />} />
        <Route path="analyses" element={<Analyses />} />
        <Route path="rapports" element={<Rapports />} />
      </Route>
    </Routes>
  );
}
