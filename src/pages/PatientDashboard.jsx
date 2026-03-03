import React, { useState } from 'react';
import {
    Heart, Calendar, FileText, ShoppingBag,
    MapPin, Clock, Download, ChevronRight,
    TrendingUp, Activity, User, Edit3, X
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import './PatientDashboard.css';

const PatientDashboard = () => {
    const { profile, prescriptions, labSamples, updatePatient, patients } = useGlobal();
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    // Get the patient record associated with this profile
    const myPatientData = patients.find(p => p.id === profile?.id) || {};
    const [editData, setEditData] = useState({ ...myPatientData });

    // Filter data for the logged-in patient
    const myPrescriptions = prescriptions.filter(p =>
        p.patient_id === profile?.id || p.patient_name === profile?.full_name
    );

    const myReports = (labSamples || []).filter(s =>
        s.patient_id === profile?.id || s.patient_name === profile?.full_name
    );

    const handleUpdate = async (e) => {
        e.preventDefault();
        await updatePatient(profile.id, editData);
        setShowUpdateModal(false);
    };

    return (
        <div className="dashboard-fade">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-main)' }}>
                <div>
                    <h1>Welcome back, {profile?.full_name || "Jane"}</h1>
                    <p className="subtitle">Securely managing your health legacy since {new Date().getFullYear()}</p>
                </div>
                <button className="primary-btn" onClick={() => setShowUpdateModal(true)}>
                    <Edit3 size={18} />
                    <span>Update Vitals</span>
                </button>
            </header>

            <section className="patient-status-grid">
                <div className="status-card glass">
                    <Heart className="status-icon" />
                    <div className="status-info">
                        <p className="subtitle">Health Score</p>
                        <h3>Optimal</h3>
                    </div>
                </div>
                <div className="status-card glass">
                    <Calendar className="status-icon" />
                    <div className="status-info">
                        <p className="subtitle">Active Bookings</p>
                        <h3>{myReports.filter(r => r.status !== 'Completed').length}</h3>
                    </div>
                </div>
                <div className="status-card glass">
                    <FileText className="status-icon" />
                    <div className="status-info">
                        <p className="subtitle">Total Records</p>
                        <h3>{myPrescriptions.length + myReports.length} Archives</h3>
                    </div>
                </div>
            </section>

            <div className="patient-main-grid">
                <section className="col-left">
                    <div className="card-header" style={{ marginBottom: '1.5rem' }}>
                        <h2>Current Vitals</h2>
                    </div>
                    <div className="health-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="metric glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: '24px' }}>
                            <p className="subtitle">BP</p>
                            <strong>{myPatientData.bp || '120/80'}</strong>
                        </div>
                        <div className="metric glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: '24px' }}>
                            <p className="subtitle">Weight</p>
                            <strong>{myPatientData.weight || '72'} kg</strong>
                        </div>
                        <div className="metric glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: '24px' }}>
                            <p className="subtitle">Glucose</p>
                            <strong>{myPatientData.glucose || '95'}</strong>
                        </div>
                    </div>

                    <div className="card-header" style={{ marginBottom: '1.5rem' }}>
                        <h2>Electronic Prescriptions</h2>
                    </div>
                    <div className="prescription-items">
                        {myPrescriptions.length > 0 ? (
                            myPrescriptions.map((pres, idx) => (
                                <div key={idx} className="patient-pres-item glass">
                                    <div className="pres-main">
                                        <div className="pres-icon"><FileText size={20} /></div>
                                        <div>
                                            <h4>{pres.medicines[0]?.name || "Medicine"} {pres.medicines.length > 1 ? `(+${pres.medicines.length - 1} more)` : ""}</h4>
                                            <p className="subtitle">By {pres.doctor} • {pres.date}</p>
                                        </div>
                                    </div>
                                    <button className="download-btn"><Download size={18} /></button>
                                </div>
                            ))
                        ) : (
                            <div className="glass" style={{ padding: '2rem', borderRadius: '20px', textAlign: 'center' }}>
                                <p className="subtitle">No digital prescriptions found.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="col-right">
                    <div className="card-header" style={{ marginBottom: '1.5rem' }}>
                        <h2>Medical Timeline</h2>
                    </div>
                    <div className="recent-reports glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                        <div className="timeline">
                            {[
                                { date: 'March 03, 2026', title: 'Cardiology Assessment', type: 'Clinical' },
                                { date: 'Feb 12, 2026', title: 'Blood Diagnostic', type: 'Lab' },
                                { date: 'Jan 15, 2026', title: 'General Wellness', type: 'Routine' }
                            ].map((item, idx) => (
                                <div key={idx} className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <p className="subtitle">{item.date}</p>
                                        <h4>{item.title}</h4>
                                        <span className="badge">{item.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="services-grid" style={{ marginTop: '2rem' }}>
                        <div className="service-card glass">
                            <Activity className="service-icon" />
                            <h3>Digital Diagnostics</h3>
                            <p className="subtitle">Book lab tests with smart reporting.</p>
                            <button className="primary-btn" style={{ margin: '1rem auto' }}>Book Now</button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Edit Profile Modal */}
            {showUpdateModal && (
                <div className="modal-overlay">
                    <div className="glass" style={{ width: '500px', padding: '2.5rem', borderRadius: '24px', animation: 'slideUp 0.4s ease-out' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>Update Health Requirements</h2>
                            <button onClick={() => setShowUpdateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="health-input-group">
                                <div>
                                    <p className="subtitle" style={{ marginBottom: '0.5rem' }}>Current Weight (kg)</p>
                                    <input className="form-input" type="number" value={editData.weight} onChange={e => setEditData({ ...editData, weight: e.target.value })} />
                                </div>
                                <div>
                                    <p className="subtitle" style={{ marginBottom: '0.5rem' }}>Blood Pressure</p>
                                    <input className="form-input" placeholder="120/80" value={editData.bp} onChange={e => setEditData({ ...editData, bp: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <p className="subtitle" style={{ marginBottom: '0.5rem' }}>Glucose Level</p>
                                <input className="form-input" type="number" value={editData.glucose} onChange={e => setEditData({ ...editData, glucose: e.target.value })} />
                            </div>
                            <button type="submit" className="primary-btn full-width" style={{ marginTop: '1rem', justifyContent: 'center' }}>Save Vital Updates</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
