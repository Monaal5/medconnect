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

const Placeholder = ({ title, role }) => (
  <div className="dashboard-fade">
    <div className="card glass shadow-sm" style={{ padding: '3rem', textAlign: 'center', border: '1px solid #dee2e6' }}>
      <h1 style={{ color: '#000', marginBottom: '1rem', fontWeight: '800' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
        Welcome to your {role} portal. This high-fidelity workspace is ready for specialized healthcare workflows.
      </p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Entry Point: Login Page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Doctor Portal */}
        <Route path="/doctor/*" element={
          <Layout role="doctor">
            <Routes>
              <Route path="/" element={<DoctorDashboard />} />
              <Route path="/patients" element={<DoctorDashboard view="patients" />} />
              <Route path="/profile" element={<DoctorDashboard view="profile" />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/labs" element={<LabDashboard />} />
            </Routes>
          </Layout>
        } />

        {/* Patient Portal */}
        <Route path="/patient/*" element={
          <Layout role="patient">
            <Routes>
              <Route path="/" element={<PatientDashboard />} />
              <Route path="/prescriptions" element={<Placeholder title="My Prescriptions & History" role="patient" />} />
              <Route path="/labs" element={<LabDashboard />} />
              <Route path="/rentals" element={<Rentals />} />
            </Routes>
          </Layout>
        } />

        {/* Chemist Portal */}
        <Route path="/chemist/*" element={
          <Layout role="chemist">
            <Routes>
              <Route path="/" element={<ChemistDashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/bills" element={<Placeholder title="GST Billing & Invoices" role="chemist" />} />
            </Routes>
          </Layout>
        } />

        {/* Lab Portal */}
        <Route path="/lab/*" element={
          <Layout role="lab">
            <Routes>
              <Route path="/" element={<LabDashboard />} />
              <Route path="/tests" element={<Placeholder title="Test Queue Management" role="lab" />} />
              <Route path="/uploads" element={<Placeholder title="Medical Result Uploads" role="lab" />} />
            </Routes>
          </Layout>
        } />

        {/* Rental Portal */}
        <Route path="/vendor/*" element={
          <Layout role="vendor">
            <Routes>
              <Route path="/" element={<Placeholder title="Rental Vendor Channel" role="vendor" />} />
              <Route path="/stock" element={<Rentals />} />
              <Route path="/rentals" element={<Placeholder title="Rental Fulfillment" role="vendor" />} />
            </Routes>
          </Layout>
        } />

        {/* Admin Portal */}
        <Route path="/admin/*" element={
          <Layout role="admin">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<Placeholder title="User Access Control" role="admin" />} />
              <Route path="/logs" element={<Placeholder title="System Audit Logs" role="admin" />} />
            </Routes>
          </Layout>
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
