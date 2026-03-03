import React, { useState } from 'react';
import {
    FlaskConical, Upload, CheckCircle2,
    AlertTriangle, Clock, Search, Filter, Plus,
    ChevronRight, FileText, Download, MoreVertical, X
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../data/mock';
import './LabDashboard.css';

const LabDashboard = () => {
    const { labSamples, uploadLabReport, addLabSample } = useGlobal();
    const [filter, setFilter] = useState('All');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [newBooking, setNewBooking] = useState({ patient_name: '', test_name: '', type: 'Home Collection', status: 'Pending', collected_at: new Date().toISOString().split('T')[0] });

    const pendingSamples = (labSamples || []).filter(s => s.status !== 'Completed');
    const completedToday = (labSamples || []).filter(s => s.status === 'Completed').length;

    const filteredSamples = (labSamples || []).filter(s =>
        filter === 'All' ? true : s.status === filter
    );

    const handleUpload = (id) => {
        const dummyUrl = `https://medconnect.storage/reports/${id}.pdf`;
        uploadLabReport(id, dummyUrl);
    };

    const handleAddBooking = async (e) => {
        e.preventDefault();
        await addLabSample(newBooking);
        setShowBookingModal(false);
        setNewBooking({ patient_name: '', test_name: '', type: 'Home Collection', status: 'Pending', collected_at: new Date().toISOString().split('T')[0] });
    };

    return (
        <div className="dashboard-fade">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-main)' }}>
                <div>
                    <h1>Diagnostic Laboratory</h1>
                    <p className="subtitle">Pathology logistics & automated reporting terminal.</p>
                </div>
                <div className="header-actions">
                    <button className="secondary-btn glass">Print Logs</button>
                    <button className="primary-btn" onClick={() => setShowBookingModal(true)}>
                        <Plus size={20} />
                        <span>Schedule Test</span>
                    </button>
                </div>
            </header>

            <section className="stats-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="stat-card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '24px' }}>
                    <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary)', padding: '12px', borderRadius: '14px' }}><Clock size={24} /></div>
                    <div>
                        <p className="subtitle">Queue Depth</p>
                        <h3 className="stat-value">{pendingSamples.length} Units</h3>
                    </div>
                </div>
                <div className="stat-card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '24px' }}>
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '14px' }}><CheckCircle2 size={24} /></div>
                    <div>
                        <p className="subtitle">Daily Throughput</p>
                        <h3 className="stat-value">{completedToday} Reports</h3>
                    </div>
                </div>
                <div className="stat-card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '24px' }}>
                    <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '14px' }}><AlertTriangle size={24} /></div>
                    <div>
                        <p className="subtitle">Critical Alerts</p>
                        <h3 className="stat-value">5 Warnings</h3>
                    </div>
                </div>
            </section>

            <div className="lab-grid">
                <section className="sample-queue glass col-left">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2>Digital Queue</h2>
                        <div className="filter-chips">
                            {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
                                <span
                                    key={f}
                                    className={`chip ${filter === f ? 'active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >{f}</span>
                            ))}
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>PATIENT DATA</th>
                                    <th>TEST PROTOCOL</th>
                                    <th>COLLECTION</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSamples.map(sample => (
                                    <tr key={sample.id}>
                                        <td className="font-mono">{sample.id.slice(0, 8)}</td>
                                        <td>
                                            <div className="patient-cell">
                                                <strong>{sample.patient_name}</strong>
                                                <span className="subtitle">{sample.type}</span>
                                            </div>
                                        </td>
                                        <td>{sample.test_name}</td>
                                        <td>{sample.collected_at}</td>
                                        <td>
                                            <span className={`status-pill ${sample.status.toLowerCase().replace(' ', '-')}`}>
                                                {sample.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button
                                                    className={`${sample.status === 'Completed' ? 'disabled' : ''}`}
                                                    onClick={() => handleUpload(sample.id)}
                                                    disabled={sample.status === 'Completed'}
                                                >
                                                    <Upload size={18} />
                                                </button>
                                                <button><MoreVertical size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="quick-actions col-right">
                    <div className="action-card glass primary" style={{ position: 'relative' }}>
                        <div className="icon"><FileText size={24} /></div>
                        <h3>Report Lab</h3>
                        <p className="subtitle">Manage automated result templates & signatures.</p>
                        <ChevronRight className="arrow" size={20} />
                    </div>
                    <div className="action-card glass" style={{ position: 'relative' }}>
                        <div className="icon"><FlaskConical size={24} /></div>
                        <h3>Test Catalog</h3>
                        <p className="subtitle">Update TAT and diagnostic pricing metrics.</p>
                        <ChevronRight className="arrow" size={20} />
                    </div>
                </section>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="modal-overlay">
                    <div className="glass" style={{ width: '500px', padding: '2.5rem', borderRadius: '24px' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>Schedule Diagnostic Test</h2>
                            <button onClick={() => setShowBookingModal(false)} style={{ background: 'none', border: 'none' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <input className="form-input" placeholder="Patient Full Name" required value={newBooking.patient_name} onChange={e => setNewBooking({ ...newBooking, patient_name: e.target.value })} />
                            <input className="form-input" placeholder="Test Name (e.g. Lipid Profile)" required value={newBooking.test_name} onChange={e => setNewBooking({ ...newBooking, test_name: e.target.value })} />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <select className="form-input" value={newBooking.type} onChange={e => setNewBooking({ ...newBooking, type: e.target.value })}>
                                    <option value="Home Collection">Home Collection</option>
                                    <option value="Walk-in">Walk-in</option>
                                    <option value="Hospital Sample">Hospital Sample</option>
                                </select>
                                <input className="form-input" type="date" required value={newBooking.collected_at} onChange={e => setNewBooking({ ...newBooking, collected_at: e.target.value })} />
                            </div>
                            <button type="submit" className="primary-btn full-width" style={{ justifyContent: 'center' }}>Confirm Booking</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabDashboard;
