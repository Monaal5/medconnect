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
        <Route path="/login" element={user ? <Navigate to="/doctor" /> : <LoginPage />} />

        {/* Doctor Portal */}
        <Route path="/doctor/*" element={
          <RequireAuth>
            <DoctorDashboard />
          </RequireAuth>
        } />

        {/* Patient Portal */}
        <Route path="/patient/*" element={
          <RequireAuth>
            <Layout role="patient">
              <Routes>
                <Route path="/" element={<PatientDashboard />} />
                <Route path="/prescriptions" element={<Placeholder title="My Prescriptions & History" role="patient" />} />
                <Route path="/labs" element={<LabDashboard />} />
                <Route path="/rentals" element={<Rentals />} />
              </Routes>
            </Layout>
          </RequireAuth>
        } />

        {/* Chemist Portal */}
        <Route path="/chemist/*" element={
          <RequireAuth>
            <Layout role="chemist">
              <Routes>
                <Route path="/" element={<ChemistDashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/bills" element={<Placeholder title="GST Billing & Invoices" role="chemist" />} />
              </Routes>
            </Layout>
          </RequireAuth>
        } />

        {/* Lab Portal */}
        <Route path="/lab/*" element={
          <RequireAuth>
            <Layout role="lab">
              <Routes>
                <Route path="/" element={<LabDashboard />} />
                <Route path="/tests" element={<Placeholder title="Test Queue Management" role="lab" />} />
                <Route path="/uploads" element={<Placeholder title="Medical Result Uploads" role="lab" />} />
              </Routes>
            </Layout>
          </RequireAuth>
        } />

        {/* Rental Portal */}
        <Route path="/vendor/*" element={
          <RequireAuth>
            <Layout role="vendor">
              <Routes>
                <Route path="/" element={<Placeholder title="Rental Vendor Channel" role="vendor" />} />
                <Route path="/stock" element={<Rentals />} />
                <Route path="/rentals" element={<Placeholder title="Rental Fulfillment" role="vendor" />} />
              </Routes>
            </Layout>
          </RequireAuth>
        } />

        {/* Admin Portal */}
        <Route path="/admin/*" element={
          <RequireAuth>
            <Layout role="admin">
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/users" element={<Placeholder title="User Access Control" role="admin" />} />
                <Route path="/logs" element={<Placeholder title="System Audit Logs" role="admin" />} />
              </Routes>
            </Layout>
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
