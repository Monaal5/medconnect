import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Inventory from './pages/Inventory';
import Rentals from './pages/Rentals';
import LabDashboard from './pages/LabDashboard';
import ChemistDashboard from './pages/ChemistDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Placeholder from './components/Placeholder';
import LandingPage from './pages/LandingPage';
import Consultation from './pages/Consultation';
import Pharmacy from './pages/Pharmacy';
import LabBookings from './pages/LabBookings';

import { useGlobal } from './context/GlobalContext';

const RequireAuth = ({ children }) => {
  const { user, loading } = useGlobal();
  if (loading) return <div className="loading-screen">MedConnect Syncing...</div>;
  return user ? children : <Navigate to="/login" />;
};

const LoginRedirect = () => {
  const { user, profile, loading } = useGlobal();
  if (loading || (user && !profile)) return <div className="loading-screen">Authenticating Hub Access...</div>;
  if (user && profile) return <Navigate to={`/${profile.role}`} />;
  return <LoginPage />;
};

function App() {
  const { user } = useGlobal();

  return (
    <Router>
      <Routes>
        {/* Entry Point: Landing Page & Generic Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/online-doctor-consultation" element={<Consultation />} />
        <Route path="/medicine" element={<Pharmacy />} />
        <Route path="/labtest" element={<LabBookings />} />
        <Route path="/login" element={<LoginRedirect />} />

        {/* Doctor Portal */}
        <Route path="/doctor/*" element={
          <RequireAuth>
            <DoctorDashboard />
          </RequireAuth>
        } />

        {/* Patient Portal */}
        <Route path="/patient/*" element={
          <RequireAuth>
            <PatientDashboard />
          </RequireAuth>
        } />

        {/* Chemist Portal */}
        <Route path="/chemist/*" element={
          <RequireAuth>
            <ChemistDashboard />
          </RequireAuth>
        } />

        {/* Lab Portal */}
        <Route path="/lab/*" element={
          <RequireAuth>
            <LabDashboard />
          </RequireAuth>
        } />

        {/* Rental Portal */}
        <Route path="/vendor/*" element={
          <RequireAuth>
            <VendorDashboard />
          </RequireAuth>
        } />

        {/* Admin Portal */}
        <Route path="/admin/*" element={
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
