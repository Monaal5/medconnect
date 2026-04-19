import React, { useState } from 'react';
import {
    Heart, Calendar, FileText, ShoppingBag,
    MapPin, Clock, Search, Shield, Pill, Stethoscope, ArrowRight,
    FlaskConical, Truck, Activity, LogOut, Edit3, X, User
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { useNavigate, Routes, Route } from 'react-router-dom';
import LabDashboard from './LabDashboard';
import Rentals from './Rentals';
import './DoctorDashboard.css'; /* Re-using the exact clinical theme */

const PatientDashboard = () => {
    const { profile, prescriptions, labSamples, updatePatient, patients, logout } = useGlobal();
    const [view, setView] = useState('hub'); // hub, discover, bookings, labs, rentals
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const navigate = useNavigate();

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
        <div className="dashboard-layout-professional">
            
            {/* Sidebar Navigation */}
            <aside className="ehr-sidebar" style={{ backgroundColor: '#0f172a' }}>
                <div className="ehr-brand">
                    <Heart size={24} color="#10b981" />
                    <span>Patient Portal</span>
                </div>
                
                <div className="ehr-nav">
                    <div className={`ehr-nav-item ${view === 'hub' ? 'active' : ''}`} onClick={() => setView('hub')}>
                        <Activity size={18} /> Health Hub & Vault
                    </div>
                    <div className={`ehr-nav-item ${view === 'discover' ? 'active' : ''}`} onClick={() => setView('discover')}>
                        <Search size={18} /> Discover Care
                    </div>
                    <div className={`ehr-nav-item ${view === 'bookings' ? 'active' : ''}`} onClick={() => setView('bookings')}>
                        <Calendar size={18} /> Appointments & Visits
                    </div>
                    <div className={`ehr-nav-item ${view === 'labs' ? 'active' : ''}`} onClick={() => setView('labs')}>
                        <FlaskConical size={18} /> Diagnostic Labs
                    </div>
                    <div className={`ehr-nav-item ${view === 'rentals' ? 'active' : ''}`} onClick={() => setView('rentals')}>
                        <Truck size={18} /> Medical Equipment
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
                        {view === 'hub' && 'Health Hub & Secure Vault'}
                        {view === 'discover' && 'Discover Care Network'}
                        {view === 'bookings' && 'Appointment Management'}
                        {view === 'labs' && 'Diagnostic Laboratory Gateway'}
                        {view === 'rentals' && 'Medical Equipment Leasing'}
                    </div>
                    <div className="ehr-header-actions">
                        <span style={{fontSize: '0.85rem', color: '#64748b', fontWeight: '600'}}>
                            {profile?.full_name || "Jane Doe"} | Patient ID: {profile?.id?.substring(0,8).toUpperCase()}
                        </span>
                        {view === 'hub' && (
                            <button className="ehr-btn ehr-btn-primary" onClick={() => setShowUpdateModal(true)}>
                                <Edit3 size={16} /> Update Vitals
                            </button>
                        )}
                        {view === 'discover' && (
                            <button className="ehr-btn ehr-btn-outline">
                                <MapPin size={16} /> GPS Enabled
                            </button>
                        )}
                    </div>
                </header>

                {/* scrollable work area */}
                <div className="ehr-scroll-area" style={{ backgroundColor: '#f8fafc' }}>
                    
                    {/* TAB 1: HEALTH HUB */}
                    {view === 'hub' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Summary Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}>
                                        <Shield size={32} />
                                    </div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Records Vault</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Encrypted Active</h3>
                                    </div>
                                </div>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px' }}>
                                        <Activity size={32} />
                                    </div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Health Score</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>Optimal</h3>
                                    </div>
                                </div>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '12px' }}>
                                        <FileText size={32} />
                                    </div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Lifetime Docs</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{myPrescriptions.length + myReports.length} Archives</h3>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                {/* Vault & Timeline */}
                                <div className="ehr-card">
                                    <div className="ehr-card-header">
                                        <h3 className="ehr-card-title">Secure Health Records Repository</h3>
                                    </div>
                                    <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1.5rem', marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        {[
                                            { date: 'March 03, 2026', title: 'Cardiology Assessment', type: 'Clinical' },
                                            { date: 'Feb 12, 2026', title: 'Blood Diagnostic', type: 'Lab' },
                                            { date: 'Jan 15, 2026', title: 'Immunization Log', type: 'Vaccine' }
                                        ].map((item, idx) => (
                                            <div key={idx} style={{ position: 'relative' }}>
                                                <div style={{ position: 'absolute', left: '-31px', top: '5px', width: '10px', height: '10px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 0 4px #eff6ff' }}></div>
                                                <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{item.date}</p>
                                                <h4 style={{ margin: '0.2rem 0', color: '#0f172a' }}>{item.title}</h4>
                                                <span className={`ehr-badge ${item.type === 'Clinical' ? 'info' : item.type === 'Lab' ? 'warning' : 'success'}`}>{item.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Medications */}
                                <div className="ehr-card">
                                    <div className="ehr-card-header">
                                        <h3 className="ehr-card-title">Medication Adherence Tracker</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {myPrescriptions.length > 0 ? (
                                            myPrescriptions.map((pres, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                                                    <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                                        <Pill size={20} color="#10b981" />
                                                    </div>
                                                    <div>
                                                        <h4 style={{ margin: 0, color: '#0f172a' }}>{pres.medicines[0]?.name || "Medicine"} {pres.medicines.length > 1 ? `(+${pres.medicines.length - 1} more)` : ""}</h4>
                                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Refill Reminder Active • By {pres.doctor}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                                <p>No recent active prescriptions.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* TAB 2: DISCOVER CARE */}
                    {view === 'discover' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="ehr-card" style={{ background: 'linear-gradient(to right, #ffffff, #f0fdf4)' }}>
                                <h2 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Network Search Engine</h2>
                                <p style={{ margin: 0, color: '#64748b' }}>Locate verified physicians, clinical facilities, and pharmaceutical stock via GPS.</p>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <input type="text" className="ehr-input" placeholder="Specialty, Doctor name, or Clinic..." style={{ flex: 2 }} />
                                    <input type="text" className="ehr-input" placeholder="Location / Zip" defaultValue="Current GPS Location" style={{ flex: 1 }} />
                                    <button className="ehr-btn ehr-btn-primary">Search Directory</button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                {/* Advanced Physician Search */}
                                <div className="ehr-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '10px' }}><Stethoscope size={20} /></div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Advanced Physician Search</h3>
                                    </div>
                                    <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: '#64748b' }}>Filter experts by specialization, ratings, and insurance coverage.</p>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        {[
                                            { name: 'Dr. Elena Rostova', spec: 'Cardiologist • 4.9⭐ • In Network' },
                                            { name: 'Dr. Ahmed Khan', spec: 'Orthopedics • 4.8⭐ • 12km Away' }
                                        ].map((dr, i) => (
                                            <div key={i} style={{ padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc' }}>
                                                <div style={{ width: '36px', height: '36px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Dr</div>
                                                <div style={{ flex: 1 }}>
                                                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a' }}>{dr.name}</strong>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{dr.spec}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Facility Proximity Search */}
                                <div className="ehr-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '10px' }}><MapPin size={20} /></div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Clinical Facility Proximity</h3>
                                    </div>
                                    <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: '#64748b' }}>Real-time GPS mapping including live emergency wait times.</p>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        <div style={{ padding: '0.85rem', border: '1px solid #fcd34d', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '1rem', background: '#fffbeb' }}>
                                            <div style={{ color: '#d97706' }}><Clock size={20} /></div>
                                            <div style={{ flex: 1 }}>
                                                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#92400e' }}>City General Hospital</strong>
                                                <span style={{ fontSize: '0.75rem', color: '#b45309' }}>3.2 miles • ER Wait: 15 mins</span>
                                            </div>
                                        </div>
                                        <div style={{ padding: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc' }}>
                                            <div style={{ color: '#64748b' }}><Clock size={20} /></div>
                                            <div style={{ flex: 1 }}>
                                                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a' }}>Valley Care Outpatient</strong>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>5.1 miles • Normal Capacity</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pharmaceutical Verifier */}
                                <div className="ehr-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '10px' }}><ShoppingBag size={20} /></div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Pharmaceutical Stock Check</h3>
                                    </div>
                                    <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: '#64748b' }}>Locate critical medications in stock at nearby pharmacies and compare prices.</p>
                                    
                                    <input type="text" className="ehr-input" placeholder="Type medicine name (e.g. Amoxicillin)..." />
                                    <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>Uses national pharma-grid API to verify shelf availability.</p>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* TAB 3: APPOINTMENTS */}
                    {view === 'bookings' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="ehr-card">
                                <div className="ehr-card-header">
                                    <h3 className="ehr-card-title">Appointment Management System</h3>
                                    <button className="ehr-btn ehr-btn-primary">Schedule New</button>
                                </div>
                                <div className="ehr-table-wrapper">
                                    <table className="ehr-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Provider / Entity</th>
                                                <th>Type</th>
                                                <th>Time</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{ fontWeight: 600 }}>12 Apr 2026</td>
                                                <td style={{ fontWeight: 600 }}>Dr. Sarah Jenkins</td>
                                                <td><span className="ehr-badge info">Online Video Consult</span></td>
                                                <td>10:30 AM</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button className="ehr-btn ehr-btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Reschedule</button>
                                                        <button className="ehr-btn ehr-btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#fca5a5' }}>Cancel</button>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontWeight: 600 }}>22 Apr 2026</td>
                                                <td style={{ fontWeight: 600 }}>City General Diagnostics</td>
                                                <td><span className="ehr-badge warning">In-Person MRI Scan</span></td>
                                                <td>02:00 PM</td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button className="ehr-btn ehr-btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Reschedule</button>
                                                        <button className="ehr-btn ehr-btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#fca5a5' }}>Cancel</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="ehr-card" style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setView('labs')} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <FlaskConical size={32} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Diagnostic Laboratory Integration</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Direct booking for pathology procedures, comprehensive lab reports, and secure physician sharing.</p>
                                </div>
                                <div className="ehr-card" style={{ cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setView('rentals')} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <Truck size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>Medical Equipment Leasing</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>Search, book, and deliver essential mobility aids, respiratory devices, and hospital beds.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DYNAMIC COMPONENT RENDER: LABS & RENTALS */}
                    {view === 'labs' && (
                        <div style={{ background: 'white', borderRadius: '8px', padding: '1rem' }}>
                            <LabDashboard disableLayoutWrapper={true} />
                        </div>
                    )}

                    {view === 'rentals' && (
                        <div style={{ background: 'white', borderRadius: '8px', padding: '1rem' }}>
                            <Rentals disableLayoutWrapper={true} />
                        </div>
                    )}

                </div>
            </main>

            {/* Modals */}
            {showUpdateModal && (
                <div className="ehr-modal-overlay" onClick={() => setShowUpdateModal(false)}>
                    <div className="ehr-form-modal" onClick={e => e.stopPropagation()}>
                        <div className="ehr-card-header" style={{ border: 'none', padding: 0 }}>
                            <h3 className="ehr-card-title">Update Health Requirements</h3>
                        </div>
                        <form onSubmit={handleUpdate} style={{ marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="ehr-form-group" style={{ flex: 1 }}>
                                    <label className="ehr-form-label">Current Weight (kg)</label>
                                    <input className="ehr-input" type="number" value={editData.weight || ''} onChange={e => setEditData({ ...editData, weight: e.target.value })} />
                                </div>
                                <div className="ehr-form-group" style={{ flex: 1 }}>
                                    <label className="ehr-form-label">Blood Pressure</label>
                                    <input className="ehr-input" placeholder="120/80" value={editData.bp || ''} onChange={e => setEditData({ ...editData, bp: e.target.value })} />
                                </div>
                            </div>
                            <div className="ehr-form-group">
                                <label className="ehr-form-label">Glucose Level</label>
                                <input className="ehr-input" type="number" value={editData.glucose || ''} onChange={e => setEditData({ ...editData, glucose: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="ehr-btn ehr-btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowUpdateModal(false)}>Cancel</button>
                                <button type="submit" className="ehr-btn ehr-btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Save Vital Updates</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
