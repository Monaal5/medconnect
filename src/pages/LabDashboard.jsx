import React, { useState } from 'react';
import {
    FlaskConical, CheckCircle2, Upload,
    AlertTriangle, Search, FileText,
    Microscope, Download, FileCheck,
    Calendar, CheckCircle, Clock, Plus, Tag,
    Settings, ShieldCheck, Mail, Send, LogOut
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../data/mock';
import './DoctorDashboard.css';

const LabDashboard = () => {
    const { profile, labSamples, uploadLabReport, logout } = useGlobal();
    const [view, setView] = useState('catalog'); // catalog, booking, queue, dissemination

    // Mock Data Models for New Features
    const [mockCatalog, setMockCatalog] = useState([
        { id: 'T-101', name: 'Comprehensive Metabolic Panel (CMP)', price: 150, tat: '24 Hours', prep: '12-Hour Fasting Recommended' },
        { id: 'T-102', name: 'Complete Blood Count (CBC)', price: 85, tat: '6 Hours', prep: 'None' },
        { id: 'T-103', name: 'Lipid Profile', price: 120, tat: '12 Hours', prep: '9-12 Hour Fasting Required' },
        { id: 'T-104', name: 'HbA1c (Glycated Hemoglobin)', price: 95, tat: '24 Hours', prep: 'None' },
        { id: 'T-105', name: 'Thyroid Function Test (TFT)', price: 180, tat: '36 Hours', prep: 'None' }
    ]);

    const [mockBookings, setMockBookings] = useState([
        { id: 'B-001', patient: 'Sarah Jenkins', test: 'Lipid Profile', type: 'At-Home Phlebotomy', date: 'Oct 24, 09:00 AM', status: 'Confirmed' },
        { id: 'B-002', patient: 'Michael Chang', test: 'Basic Metabolic Panel', type: 'Clinical Walk-in', date: 'Oct 24, 11:30 AM', status: 'Pending' },
        { id: 'B-003', patient: 'Elena Rostova', test: 'Thyroid Function Test', type: 'At-Home Phlebotomy', date: 'Oct 25, 08:00 AM', status: 'Confirmed' }
    ]);

    const pendingSamples = (labSamples || []).filter(s => s.status !== 'Completed');
    const disseminatedReports = (labSamples || []).filter(s => s.status === 'Completed');

    const handleUpload = (id) => {
        const dummyUrl = `https://medconnect.storage/reports/${id}.pdf`;
        uploadLabReport(id, dummyUrl);
    };

    return (
        <div className="dashboard-layout-professional">
            
            {/* Sidebar Navigation */}
            <aside className="ehr-sidebar" style={{ backgroundColor: '#0f172a' }}>
                <div className="ehr-brand" style={{ color: '#ffffff', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '1rem', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Microscope size={24} color="#3b82f6" />
                        <span style={{ fontSize: '1.25rem' }}>Core Diagnostics</span>
                    </div>
                </div>

                {/* ACCREDITATION STATUS DISPLAY */}
                <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                            <ShieldCheck size={16} /> ACCREDITED FACILITY
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            <span style={{ display: 'block' }}>• NABL Certified Lab (ISO 15189)</span>
                            <span style={{ display: 'block' }}>• CAP Accredited</span>
                        </div>
                    </div>
                </div>
                
                <div className="ehr-nav">
                    <div className={`ehr-nav-item ${view === 'catalog' ? 'active' : ''}`} onClick={() => setView('catalog')}>
                        <FileText size={18} /> Test Service Catalog
                    </div>
                    <div className={`ehr-nav-item ${view === 'booking' ? 'active' : ''}`} onClick={() => setView('booking')}>
                        <Calendar size={18} /> Specimen Booking
                    </div>
                    <div className={`ehr-nav-item ${view === 'queue' ? 'active' : ''}`} onClick={() => setView('queue')}>
                        <FlaskConical size={18} /> Physician Order Queue
                        {pendingSamples.length > 0 && <span className="ehr-badge warning" style={{marginLeft: 'auto'}}>{pendingSamples.length}</span>}
                    </div>
                    <div className={`ehr-nav-item ${view === 'dissemination' ? 'active' : ''}`} onClick={() => setView('dissemination')}>
                        <Mail size={18} /> Report Dissemination
                    </div>
                </div>

                <div style={{ marginTop: 'auto', padding: '0 1rem' }}>
                    <div className="ehr-nav-item" onClick={logout} style={{color: '#f87171'}}>
                        <LogOut size={18} /> Sign Out Safely
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ehr-main-content">
                
                {/* Header Bar */}
                <header className="ehr-header">
                    <div className="ehr-header-title">
                        {view === 'catalog' && 'Comprehensive Test Service Catalog'}
                        {view === 'booking' && 'Specimen Collection & Scheduling'}
                        {view === 'queue' && 'Global Diagnostic Order Queue'}
                        {view === 'dissemination' && 'Automated Report Dissemination'}
                    </div>
                    <div className="ehr-header-actions">
                        <span style={{fontSize: '0.85rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldCheck size={16} color="#10b981" />
                            NABL/CAP Compliant Node | Lab UUID: {profile?.id?.substring(0,6).toUpperCase() || 'SYS-99'}
                        </span>
                        {view === 'catalog' && (
                            <button className="ehr-btn ehr-btn-primary">
                                <Plus size={16} /> Add Test Protocol
                            </button>
                        )}
                    </div>
                </header>

                <div className="ehr-scroll-area">

                    {/* View: TEST SERVICE CATALOG */}
                    {view === 'catalog' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="ehr-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <Settings color="#3b82f6" />
                                    <h2 style={{ margin: 0, color: '#0f172a' }}>Diagnostic Protocol Matrix</h2>
                                </div>
                                <p style={{ margin: 0, color: '#64748b' }}>Manage pricing schedules, required patient preparations, and turnaround times (TAT) for the public-facing marketplace.</p>
                            </div>

                            <div className="ehr-card">
                                <div className="ehr-card-header">
                                    <h3 className="ehr-card-title">Available Bio-Assays</h3>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
                                        <input type="text" placeholder="Search parameters..." className="ehr-input" style={{ paddingLeft: '2rem', width: '300px' }} />
                                    </div>
                                </div>
                                <div className="ehr-table-wrapper">
                                    <table className="ehr-table">
                                        <thead>
                                            <tr>
                                                <th>Code</th>
                                                <th>Diagnostic Portfolio</th>
                                                <th>Base Price</th>
                                                <th>Turnaround Time (TAT)</th>
                                                <th>Patient Preparation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockCatalog.map(item => (
                                                <tr key={item.id}>
                                                    <td style={{ fontWeight: 600, color: '#64748b' }}>{item.id}</td>
                                                    <td style={{ fontWeight: 500, color: '#0f172a' }}>{item.name}</td>
                                                    <td style={{ fontWeight: 700 }}>{formatCurrency(item.price)}</td>
                                                    <td><span className="ehr-badge info"><Clock size={12} style={{marginRight: '4px'}}/>{item.tat}</span></td>
                                                    <td style={{ color: '#475569', fontSize: '0.85rem' }}>{item.prep}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* View: SPECIMEN BOOKING */}
                    {view === 'booking' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px' }}><Calendar size={32} /></div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Active Appointments</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{mockBookings.length} Slots Filled</h3>
                                    </div>
                                </div>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '12px' }}><Upload size={32} /></div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>At-Home Dispatches</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>2 Fleet Vehicles Active</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="ehr-card">
                                <div className="ehr-card-header">
                                    <h3 className="ehr-card-title">Specimen Collection Schedule</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {mockBookings.map(booking => (
                                        <div key={booking.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                                            <div>
                                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                    <span className={booking.status === 'Confirmed' ? 'ehr-badge success' : 'ehr-badge warning'}>{booking.status}</span>
                                                    <span className="ehr-badge info">{booking.type}</span>
                                                </div>
                                                <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1.1rem' }}>{booking.patient}</h4>
                                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Protocol: {booking.test}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>{booking.date}</div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button className="ehr-btn ehr-btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Reschedule</button>
                                                    <button className="ehr-btn ehr-btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Mark Collected</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View: DIAGNOSTICS QUEUE (PHYSICIAN SYSTEM INTEGRATION) */}
                    {view === 'queue' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                             <div className="ehr-card" style={{ background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <AlertTriangle color="#f59e0b" />
                                    <h2 style={{ margin: 0, color: 'white' }}>Physician Orders & Internal Routing</h2>
                                </div>
                                <p style={{ margin: 0, color: '#94a3b8' }}>Direct integration with the Physician Dashboard. Diagnostic orders initiated by doctors are routed securely into this pipeline.</p>
                            </div>

                            <div className="ehr-card">
                                <div className="ehr-card-header">
                                    <h3 className="ehr-card-title">Pending Bio-Samples</h3>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
                                        <input type="text" placeholder="Search Patient Data..." className="ehr-input" style={{ paddingLeft: '2rem', width: '300px' }} />
                                    </div>
                                </div>
                                <div className="ehr-table-wrapper">
                                    <table className="ehr-table">
                                        <thead>
                                            <tr>
                                                <th>Batch ID / Origin</th>
                                                <th>Patient Demographics</th>
                                                <th>Required Test Protocol</th>
                                                <th>Status</th>
                                                <th>Data Push</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingSamples.map(sample => (
                                                <tr key={sample.id}>
                                                    <td>
                                                        <span style={{fontFamily: 'monospace', color: '#64748b', display: 'block'}}>{sample.id.slice(0, 8)}</span>
                                                        <span className="ehr-badge info" style={{ fontSize: '0.6rem', marginTop: '0.2rem', display: 'inline-block' }}>Doctor Ordered</span>
                                                    </td>
                                                    <td>
                                                        <strong style={{ color: '#0f172a', display: 'block' }}>{sample.patient_name}</strong>
                                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{sample.type}</span>
                                                    </td>
                                                    <td style={{ fontWeight: 500 }}>{sample.test_name}</td>
                                                    <td><span className="ehr-badge warning">Processing</span></td>
                                                    <td>
                                                        <button className="ehr-btn ehr-btn-primary" onClick={() => handleUpload(sample.id)}>
                                                            <Upload size={14} style={{ marginRight: '4px' }} /> Process & Send
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {pendingSamples.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No pending lab samples from doctors.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* View: AUTOMATED REPORT DISSEMINATION */}
                    {view === 'dissemination' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="ehr-card">
                                <div className="ehr-card-header">
                                    <h3 className="ehr-card-title">Digital Autonomic Dissemination Engine</h3>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                                    Final reports generated and signed by the laboratory are automatically dispatched back to the ordering physician's dashboard and the patient's personal engagement portal via TLS 1.3 encryption.
                                </p>

                                <div className="ehr-table-wrapper">
                                    <table className="ehr-table">
                                        <thead>
                                            <tr>
                                                <th>Verification Date</th>
                                                <th>Subject / Patient</th>
                                                <th>Test Matrix Profile</th>
                                                <th>Dissemination Routing</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {disseminatedReports.map((sample, i) => (
                                                <tr key={i}>
                                                    <td style={{ fontSize: '0.85rem' }}>{sample.collected_at}</td>
                                                    <td style={{ fontWeight: 600 }}>{sample.patient_name}</td>
                                                    <td>{sample.test_name}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                            <span className="ehr-badge" style={{ background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe' }}>Patient Portal</span>
                                                            <span className="ehr-badge" style={{ background: '#f5f3ff', color: '#8b5cf6', border: '1px solid #ddd6fe' }}>Doc Dashboard</span>
                                                        </div>
                                                    </td>
                                                    <td><span className="ehr-badge success"><Send size={12} style={{marginRight: '4px'}}/> Dispatched</span></td>
                                                </tr>
                                            ))}
                                            {disseminatedReports.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No reports have been disseminated yet. Process a sample in the queue.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default LabDashboard;
