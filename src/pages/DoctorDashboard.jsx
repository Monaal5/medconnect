import React, { useState, useEffect } from 'react';
import {
    Users, Calendar, Activity, Clock,
    Search, Plus, Filter, ChevronRight,
    TrendingUp, TrendingDown, X, Package,
    Settings, LayoutDashboard
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import PrescriptionGenerator from '../components/PrescriptionGenerator';
import { getGeminiResponse } from '../lib/geminiClient';
import './DoctorDashboard.css';

const DoctorDashboard = ({ view: initialView }) => {
    const { patients, medicines, prescriptions, loading, addPatient, addMedicine, profile, updateProfile } = useGlobal();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showGenerator, setShowGenerator] = useState(false);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [aiQuery, setAiQuery] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '', blood_type: '', weight: '', bp: '', glucose: '' });
    const [newMed, setNewMed] = useState({ name: '', category: '', stock: '', price: '' });

    const [view, setView] = useState(initialView || 'overview');

    useEffect(() => {
        if (initialView) setView(initialView);
    }, [initialView]);
    const [clinicForm, setClinicForm] = useState({
        full_name: profile?.full_name || '',
        clinic_name: profile?.clinic_name || '',
        degree: profile?.degree || '',
        clinic_address: profile?.clinic_address || '',
        clinic_logo: profile?.clinic_logo || ''
    });

    useEffect(() => {
        if (profile) {
            setClinicForm({
                full_name: profile.full_name || '',
                clinic_name: profile.clinic_name || '',
                degree: profile.degree || '',
                clinic_address: profile.clinic_address || '',
                clinic_logo: profile.clinic_logo || ''
            });
        }
    }, [profile]);

    const handleUpdateClinic = async (e) => {
        e.preventDefault();
        await updateProfile(clinicForm);
        setView('overview');
    };

    useEffect(() => {
        if (patients.length > 0 && !selectedPatient) {
            setSelectedPatient(patients[0]);
        }
    }, [patients]);

    const handleAddPatient = async (e) => {
        e.preventDefault();
        await addPatient(newPatient);
        setShowPatientModal(false);
        setNewPatient({ name: '', age: '', gender: '', blood_type: '', weight: '', bp: '', glucose: '' });
    };

    const handleAddMed = async (e) => {
        e.preventDefault();
        await addMedicine(newMed);
        setShowStockModal(false);
        setNewMed({ name: '', category: '', stock: '', price: '' });
    };

    const askAI = async () => {
        if (!aiQuery) return;
        setAiLoading(true);
        const response = await getGeminiResponse(aiQuery);
        setAiResponse(response);
        setAiLoading(false);
    };

    if (loading) return <div className="loading">Loading Clinic Data...</div>;

    // Filter prescriptions for selected patient
    const patientHistory = prescriptions
        .filter(p => p.patient_id === selectedPatient?.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter low stock medicines
    const lowStockCount = medicines.filter(m => m.stock < 20).length;

    return (
        <div className="dashboard-fade">
            <header className="dashboard-header">
                <div>
                    <h1 className="clinic-title">{profile?.clinic_name || "MedConnect Clinic"}</h1>
                    <p className="subtitle">
                        Dr. {profile?.full_name || "Smith"} • {profile?.degree || "MBBS, MD"}
                    </p>
                </div>
                <div className="header-actions">
                    <button className={`secondary-btn glass ${view === 'profile' ? 'active' : ''}`} onClick={() => setView(view === 'overview' ? 'profile' : 'overview')}>
                        {view === 'overview' ? <Settings size={18} /> : <LayoutDashboard size={18} />}
                        <span>{view === 'overview' ? 'Clinic Settings' : 'Back to Dashboard'}</span>
                    </button>
                    {view === 'overview' && (
                        <>
                            <button className="secondary-btn glass" onClick={() => setShowStockModal(true)}>
                                <Package size={18} />
                                <span>Inventory</span>
                            </button>
                            <button className="secondary-btn glass" onClick={() => setShowPatientModal(true)}>
                                <Users size={18} />
                                <span>New Patient</span>
                            </button>
                            <button className="primary-btn pulse-btn" onClick={() => setShowGenerator(true)}>
                                <Activity size={18} />
                                <span>Prescribe</span>
                            </button>
                        </>
                    )}
                </div>
            </header>

            {view === 'overview' ? (
                <>
                    <section className="stats-strip">
                        <div className="stat-card glass">
                            <div className="stat-icon"><Users size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-title">Patient Load</span>
                                <h3 className="stat-value">{patients.length}</h3>
                                <span className="stat-trend plus">Optimal capacity</span>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon"><Activity size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-title">Daily Consults</span>
                                <h3 className="stat-value">24</h3>
                                <span className="stat-trend plus">8 Pending</span>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon"><TrendingUp size={24} /></div>
                            <div className="stat-content">
                                <span className="stat-title">Critical Alerts</span>
                                <h3 className="stat-value">{lowStockCount}</h3>
                                <span className="stat-trend minus">Pharmacy attention</span>
                            </div>
                        </div>
                    </section>

                    <div className="dashboard-grid">
                        <section className="patients-list glass">
                            <div className="card-header">
                                <h2>Patient Directory</h2>
                                <div className="search-mini">
                                    <Search size={16} />
                                    <input type="text" placeholder="Search by name or ID..." />
                                </div>
                            </div>
                            <div className="patient-items">
                                {patients.map((p) => (
                                    <div
                                        key={p.id}
                                        className={`patient-row ${selectedPatient?.id === p.id ? 'active' : ''}`}
                                        onClick={() => setSelectedPatient(p)}
                                    >
                                        <div className="p-avatar">{p.name?.charAt(0)}</div>
                                        <div className="p-info">
                                            <h4>{p.name}</h4>
                                            <p>{p.gender}, {p.age}y • {p.blood_type}</p>
                                        </div>
                                        <ChevronRight size={16} className="arrow" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="main-work-area">
                            {showGenerator ? (
                                <div className="generator-wrapper glass-card">
                                    <div className="work-header">
                                        <button className="back-link" onClick={() => setShowGenerator(false)}>← Dashboard Overview</button>
                                        <h2>Clinical Order: {selectedPatient?.name}</h2>
                                    </div>
                                    <PrescriptionGenerator patient={selectedPatient} />
                                </div>
                            ) : (
                                <div className="patient-summary glass">
                                    <div className="summary-header">
                                        <div className="p-large-avatar">{selectedPatient?.name?.charAt(0)}</div>
                                        <div className="p-heading">
                                            <h2>{selectedPatient?.name}</h2>
                                            <p className="p-id-tag">PATIENT ID: {selectedPatient?.id} • SECURE LOGS</p>
                                        </div>
                                    </div>

                                    <div className="health-metrics">
                                        <div className="metric">
                                            <span>Weight</span>
                                            <strong>{selectedPatient?.weight || '72'} kg</strong>
                                        </div>
                                        <div className="metric">
                                            <span>Vitals (BP)</span>
                                            <strong>{selectedPatient?.bp || '120/80'}</strong>
                                        </div>
                                        <div className="metric">
                                            <span>Glucose</span>
                                            <strong>{selectedPatient?.glucose || '95'} mg/dL</strong>
                                        </div>
                                    </div>

                                    <div className="clinical-ai-section">
                                        <h3 className="ai-title">
                                            <Activity size={18} className="pulse-icon" />
                                            Clinical Insight Engine
                                        </h3>
                                        <div className="ai-chat">
                                            {aiResponse || "Clinical Assistant ready. Ingest symptoms for diagnosis support or drug interaction checks."}
                                        </div>
                                        <div className="ai-input-wrapper">
                                            <input
                                                type="text"
                                                placeholder="Enter clinical query..."
                                                value={aiQuery}
                                                onChange={(e) => setAiQuery(e.target.value)}
                                            />
                                            <button onClick={askAI} disabled={aiLoading} className="primary-btn">
                                                {aiLoading ? 'Analyzing...' : 'Execute'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="recent-activity" style={{ marginTop: '2.5rem' }}>
                                        <h3 className="section-title">Clinical History</h3>
                                        {patientHistory.length > 0 ? (
                                            patientHistory.map((item, idx) => (
                                                <div key={idx} className="activity-item">
                                                    <div className="act-dot"></div>
                                                    <div className="act-content">
                                                        <p className="act-date">{item.date}</p>
                                                        <p className="act-title">Prescription • {item.doctor}</p>
                                                        <p className="act-desc">
                                                            {item.medicines?.map(m => `${m.name} (${m.dose})`).join(', ')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="empty-msg">No clinical data on record.</p>
                                        )}
                                    </div>

                                    <button className="primary-btn full-width" onClick={() => setShowGenerator(true)} style={{ marginTop: '2rem', padding: '1.25rem' }}>
                                        Initiate New Clinical Order
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>
                </>
            ) : view === 'patients' ? (
                <div className="patients-full-view dashboard-fade">
                    <div className="section-header">
                        <h2>Patient Directory</h2>
                        <div className="directory-actions">
                            <div className="search-large">
                                <Search size={22} />
                                <input type="text" placeholder="Search by name, ID, blood type or symptoms..." />
                            </div>
                            <button className="primary-btn pulse-btn" onClick={() => setShowPatientModal(true)}>
                                <Plus size={18} />
                                <span>Register New Patient</span>
                            </button>
                        </div>
                    </div>
                    <div className="patients-grid-detailed">
                        {patients.map(p => (
                            <div key={p.id} className="patient-card-detailed glass" onClick={() => { setSelectedPatient(p); setView('overview'); }}>
                                <div className="p-badge">{p.blood_type || 'O+'}</div>
                                <div className="p-card-header">
                                    <div className="p-avatar-large">{p.name?.charAt(0)}</div>
                                    <div className="p-main-info">
                                        <h3>{p.name}</h3>
                                        <p className="p-id">{p.id}</p>
                                    </div>
                                </div>
                                <div className="p-card-metrics">
                                    <div className="p-metric-item">
                                        <label>Age</label>
                                        <span>{p.age}y</span>
                                    </div>
                                    <div className="p-metric-item">
                                        <label>BP</label>
                                        <span>{p.bp || '120/80'}</span>
                                    </div>
                                    <div className="p-metric-item">
                                        <label>Weight</label>
                                        <span>{p.weight || '70'}kg</span>
                                    </div>
                                </div>
                                <div className="card-footer-actions">
                                    <div className="status-indicator">
                                        <div className="pulse-dot"></div>
                                        <span>Active File</span>
                                    </div>
                                    <button className="ghost-btn">
                                        View History →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="clinic-settings-container glass dashboard-fade">
                    <div className="settings-header">
                        <h2>Clinic & Professional Registration</h2>
                        <p>This information will appear on all digital prescriptions and patient reports.</p>
                    </div>
                    <form onSubmit={handleUpdateClinic} className="clinical-form">
                        <div className="settings-grid">
                            <div className="form-section">
                                <label>Professional Identity</label>
                                <div className="input-group">
                                    <span className="input-prefix">Dr.</span>
                                    <input className="form-input" placeholder="Full Name (e.g. John Doe)" value={clinicForm.full_name} onChange={e => setClinicForm({ ...clinicForm, full_name: e.target.value })} />
                                </div>
                                <input className="form-input" placeholder="Medical Degree (e.g. MBBS, MD, Cardiology)" value={clinicForm.degree} onChange={e => setClinicForm({ ...clinicForm, degree: e.target.value })} />
                            </div>
                            <div className="form-section">
                                <label>Clinic Branding</label>
                                <input className="form-input" placeholder="Clinic / Hospital Name" value={clinicForm.clinic_name} onChange={e => setClinicForm({ ...clinicForm, clinic_name: e.target.value })} />
                                <input className="form-input" placeholder="Clinic Logo URL (Optional)" value={clinicForm.clinic_logo} onChange={e => setClinicForm({ ...clinicForm, clinic_logo: e.target.value })} />
                            </div>
                            <div className="form-section full-width">
                                <label>Clinic Location & Contact</label>
                                <textarea className="form-input" placeholder="Full Address, Contact No." rows="3" value={clinicForm.clinic_address} onChange={e => setClinicForm({ ...clinicForm, clinic_address: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="secondary-btn" onClick={() => setView('overview')}>Cancel</button>
                            <button type="submit" className="primary-btn">Save Clinical Profile</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modals */}
            {showPatientModal && (
                <div className="modal-overlay">
                    <div className="clinical-modal glass">
                        <div className="modal-header">
                            <div>
                                <h2>Register New Patient</h2>
                                <p className="modal-subtitle">Add to clinical directory</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowPatientModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleAddPatient} className="clinical-form">
                            <div className="form-section">
                                <label>Personal Information</label>
                                <input className="form-input" placeholder="Patient Full Name" required value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} />
                                <div className="form-row">
                                    <input className="form-input" placeholder="Age" type="number" required value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} />
                                    <select className="form-input" required value={newPatient.gender} onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}>
                                        <option value="">Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-section">
                                <label>Vital Metrics</label>
                                <div className="form-row">
                                    <input className="form-input" placeholder="Blood Type" value={newPatient.blood_type} onChange={e => setNewPatient({ ...newPatient, blood_type: e.target.value })} />
                                    <input className="form-input" placeholder="Weight (kg)" type="number" value={newPatient.weight} onChange={e => setNewPatient({ ...newPatient, weight: e.target.value })} />
                                </div>
                                <div className="form-row">
                                    <input className="form-input" placeholder="BP (e.g. 120/80)" value={newPatient.bp} onChange={e => setNewPatient({ ...newPatient, bp: e.target.value })} />
                                    <input className="form-input" placeholder="Glucose (mg/dL)" type="number" value={newPatient.glucose} onChange={e => setNewPatient({ ...newPatient, glucose: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="primary-btn full-width">Add Patient to Directory</button>
                        </form>
                    </div>
                </div>
            )}

            {showStockModal && (
                <div className="modal-overlay">
                    <div className="clinical-modal glass">
                        <div className="modal-header">
                            <div>
                                <h2>Inventory Management</h2>
                                <p className="modal-subtitle">Update clinic pharmacy stock</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowStockModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleAddMed} className="clinical-form">
                            <div className="form-section">
                                <label>Medicine Details</label>
                                <input className="form-input" placeholder="Medicine Name" required value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
                                <input className="form-input" placeholder="Category (e.g. Antibiotic, Painkiller)" required value={newMed.category} onChange={e => setNewMed({ ...newMed, category: e.target.value })} />
                            </div>
                            <div className="form-section">
                                <label>Stock & Pricing</label>
                                <div className="form-row">
                                    <input className="form-input" placeholder="Initial Stock" type="number" required value={newMed.stock} onChange={e => setNewMed({ ...newMed, stock: e.target.value })} />
                                    <input className="form-input" placeholder="Price per Unit ($)" type="number" step="0.01" required value={newMed.price} onChange={e => setNewMed({ ...newMed, price: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="primary-btn full-width">Sync with Inventory</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
