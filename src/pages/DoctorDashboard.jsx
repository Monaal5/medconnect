import React, { useState, useEffect } from 'react';
import {
    Users, Calendar, Activity, Clock,
    Search, Plus, Filter, ChevronRight,
    Package, Settings, AlertCircle, FileText,
    LogOut
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import PrescriptionGenerator from '../components/PrescriptionGenerator';
import './DoctorDashboard.css';

const DoctorDashboard = ({ view: initialView }) => {
    const { patients, medicines, loading, addPatient, addMedicine, profile, updateProfile, logout } = useGlobal();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    
    const [view, setView] = useState(initialView || 'patients');

    const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '', blood_type: '', weight: '', bp: '', glucose: '' });
    const [newMed, setNewMed] = useState({ name: '', category: '', stock: '', price: '' });
    const [clinicForm, setClinicForm] = useState({
        full_name: profile?.full_name || '',
        clinic_name: profile?.clinic_name || '',
        degree: profile?.degree || '',
        clinic_address: profile?.clinic_address || '',
        clinic_logo: profile?.clinic_logo || ''
    });

    useEffect(() => {
        if (initialView) setView(initialView);
    }, [initialView]);

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
        setView('patients');
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        const added = await addPatient(newPatient);
        if (added) {
            setSelectedPatient(added);
            setView('prescribe');
        }
        setShowPatientModal(false);
        setNewPatient({ name: '', age: '', gender: '', blood_type: '', weight: '', bp: '', glucose: '' });
    };

    const handleAddMed = async (e) => {
        e.preventDefault();
        await addMedicine(newMed);
        setShowStockModal(false);
        setNewMed({ name: '', category: '', stock: '', price: '' });
    };

    if (loading) return <div style={{padding: '3rem', textAlign: 'center', fontFamily: 'Inter'}}>Loading EHR System...</div>;

    const lowStockMeds = medicines.filter(m => m.stock < 20);

    return (
        <div className="dashboard-layout-professional">
            
            {/* Sidebar Navigation */}
            <aside className="ehr-sidebar">
                <div className="ehr-brand">
                    <Activity size={24} />
                    <span>MedConnect+ EHR</span>
                </div>
                
                <div className="ehr-nav">
                    <div className={`ehr-nav-item ${view === 'patients' ? 'active' : ''}`} onClick={() => setView('patients')}>
                        <Users size={18} /> Patient Directory
                    </div>
                    <div className={`ehr-nav-item ${(view === 'prescribe' || view === 'overview') ? 'active' : ''}`} onClick={() => {
                        if (patients.length > 0) {
                            setSelectedPatient(patients[0]);
                            setView('prescribe');
                        }
                    }}>
                        <FileText size={18} /> Clinical Orders
                    </div>
                    <div className={`ehr-nav-item ${view === 'inventory' ? 'active' : ''}`} onClick={() => setView('inventory')}>
                        <Package size={18} /> Pharmacy Stock
                        {lowStockMeds.length > 0 && (
                            <span className="ehr-badge warning" style={{marginLeft: 'auto'}}>{lowStockMeds.length}</span>
                        )}
                    </div>
                    <div className={`ehr-nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}>
                        <Settings size={18} /> Clinic Settings
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
                        {view === 'patients' && 'Patient Directory'}
                        {(view === 'prescribe' || view === 'overview') && (selectedPatient ? `Clinical Order: ${selectedPatient.name}` : 'Clinical Orders')}
                        {view === 'inventory' && 'Inventory Management'}
                        {view === 'settings' && 'Clinic Configuration'}
                    </div>
                    <div className="ehr-header-actions">
                        <span style={{fontSize: '0.85rem', color: '#64748b', fontWeight: '600'}}>
                            Dr. {profile?.full_name || "Smith"} | {profile?.clinic_name || "Primary Care"}
                        </span>
                        {(view === 'patients' || view === 'overview' || view === 'prescribe') && (
                            <button className="ehr-btn ehr-btn-primary" onClick={() => setShowPatientModal(true)}>
                                <Plus size={16} /> New Patient
                            </button>
                        )}
                        {view === 'inventory' && (
                            <button className="ehr-btn ehr-btn-primary" onClick={() => setShowStockModal(true)}>
                                <Plus size={16} /> Add Stock
                            </button>
                        )}
                    </div>
                </header>

                {/* scrollable work area */}
                <div className="ehr-scroll-area">
                    
                    {view === 'patients' && (
                        <div className="ehr-card">
                            <div className="ehr-card-header">
                                <h3 className="ehr-card-title">Registered Patients</h3>
                                <div style={{position: 'relative'}}>
                                    <Search size={16} style={{position: 'absolute', left: '10px', top: '10px', color: '#888'}}/>
                                    <input type="text" placeholder="Search EHR id, name..." className="ehr-input" style={{paddingLeft: '2rem', width: '250px'}} />
                                </div>
                            </div>
                            <div className="ehr-table-wrapper">
                                <table className="ehr-table">
                                    <thead>
                                        <tr>
                                            <th>EHR ID</th>
                                            <th>Patient Name</th>
                                            <th>Age / Sex</th>
                                            <th>Blood Type</th>
                                            <th>Last BP</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.map(p => (
                                            <tr key={p.id}>
                                                <td style={{fontFamily: 'monospace', color: '#64748b'}}>{p.id.substring(0,8).toUpperCase()}</td>
                                                <td style={{fontWeight: '600'}}>{p.name}</td>
                                                <td>{p.age}y / {p.gender?.charAt(0) || 'U'}</td>
                                                <td><span className="ehr-badge info">{p.blood_type || 'N/A'}</span></td>
                                                <td>{p.bp || '120/80'}</td>
                                                <td>
                                                    <button className="ehr-btn ehr-btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}} onClick={() => {
                                                        setSelectedPatient(p);
                                                        setView('prescribe');
                                                    }}>
                                                        Prescribe <ChevronRight size={14}/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {patients.length === 0 && (
                                            <tr>
                                                <td colSpan="6" style={{textAlign: 'center', padding: '3rem', color: '#888'}}>
                                                    No patients registered in the directory.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {(view === 'prescribe' || view === 'overview') && (
                        <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                            {selectedPatient ? (
                                <PrescriptionGenerator patient={selectedPatient} />
                            ) : (
                                <div style={{textAlign: 'center', margin: '4rem 0'}}>
                                    <Users size={48} color="#cbd5e1" style={{marginBottom: '1rem'}} />
                                    <h3>No Patient Selected</h3>
                                    <p>Please select a patient from the directory to start a clinical order.</p>
                                    <br/>
                                    <button className="ehr-btn ehr-btn-primary" onClick={() => setView('patients')} style={{margin: '0 auto'}}>
                                        Open Directory
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {view === 'inventory' && (
                        <div className="ehr-card">
                            <div className="ehr-card-header">
                                <h3 className="ehr-card-title">Pharmacy Stock Levels</h3>
                            </div>
                            <div className="ehr-table-wrapper">
                                <table className="ehr-table">
                                    <thead>
                                        <tr>
                                            <th>Medicine Name</th>
                                            <th>Category</th>
                                            <th>In Stock (Units)</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicines.map(m => (
                                            <tr key={m.id}>
                                                <td style={{fontWeight: '600'}}>{m.name}</td>
                                                <td>{m.category || 'General'}</td>
                                                <td>
                                                    <span className={`ehr-badge ${m.stock < 20 ? 'danger' : 'success'}`}>
                                                        {m.stock} Units {m.stock < 20 && '(Low)'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="ehr-btn ehr-btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>
                                                        Order Refill
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {view === 'settings' && (
                        <div className="ehr-card" style={{maxWidth: '800px'}}>
                            <div className="ehr-card-header">
                                <div>
                                    <h3 className="ehr-card-title">Professional Identity & Clinic Setup</h3>
                                    <p style={{fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem'}}>This information appears on generated PDF prescriptions.</p>
                                </div>
                            </div>
                            <form onSubmit={handleUpdateClinic} style={{padding: '1rem 0'}}>
                                <div className="ehr-form-group">
                                    <label className="ehr-form-label">Doctor Full Name</label>
                                    <input className="ehr-input" placeholder="e.g. John Doe" value={clinicForm.full_name} onChange={e => setClinicForm({...clinicForm, full_name: e.target.value})} />
                                </div>
                                <div className="ehr-form-group">
                                    <label className="ehr-form-label">Medical Degree & Reg No.</label>
                                    <input className="ehr-input" placeholder="e.g. MBBS, MD | MCI Registration No. 123456" value={clinicForm.degree} onChange={e => setClinicForm({...clinicForm, degree: e.target.value})} />
                                </div>
                                <div className="ehr-form-group">
                                    <label className="ehr-form-label">Clinic / Hospital Name</label>
                                    <input className="ehr-input" placeholder="e.g. City Care Multispeciality" value={clinicForm.clinic_name} onChange={e => setClinicForm({...clinicForm, clinic_name: e.target.value})} />
                                </div>
                                <div className="ehr-form-group">
                                    <label className="ehr-form-label">Clinic Address & Contact</label>
                                    <textarea className="ehr-input" rows="3" placeholder="Full address and phone number for letterhead" value={clinicForm.clinic_address} onChange={e => setClinicForm({...clinicForm, clinic_address: e.target.value})}></textarea>
                                </div>
                                <button type="submit" className="ehr-btn ehr-btn-primary" style={{marginTop: '1rem'}}>Save Configuration</button>
                            </form>
                        </div>
                    )}

                </div>
            </main>

            {/* Modals */}
            {showPatientModal && (
                <div className="ehr-modal-overlay" onClick={() => setShowPatientModal(false)}>
                    <div className="ehr-form-modal" onClick={e => e.stopPropagation()}>
                        <div className="ehr-card-header" style={{border: 'none', padding: 0}}>
                            <h3 className="ehr-card-title">Register New Patient</h3>
                        </div>
                        <form onSubmit={handleAddPatient} style={{marginTop: '1.5rem'}}>
                            <div className="ehr-form-group">
                                <label className="ehr-form-label">Full Name</label>
                                <input required className="ehr-input" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
                            </div>
                            <div style={{display: 'flex', gap: '1rem'}}>
                                <div className="ehr-form-group" style={{flex: 1}}>
                                    <label className="ehr-form-label">Age</label>
                                    <input required type="number" className="ehr-input" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} />
                                </div>
                                <div className="ehr-form-group" style={{flex: 1}}>
                                    <label className="ehr-form-label">Gender</label>
                                    <select required className="ehr-input" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})}>
                                        <option value="">Select...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '1rem'}}>
                                <div className="ehr-form-group" style={{flex: 1}}>
                                    <label className="ehr-form-label">Blood Type (Optional)</label>
                                    <input className="ehr-input" value={newPatient.blood_type} onChange={e => setNewPatient({...newPatient, blood_type: e.target.value})} />
                                </div>
                                <div className="ehr-form-group" style={{flex: 1}}>
                                    <label className="ehr-form-label">Vitals (BP)</label>
                                    <input className="ehr-input" placeholder="120/80" value={newPatient.bp} onChange={e => setNewPatient({...newPatient, bp: e.target.value})} />
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                                <button type="button" className="ehr-btn ehr-btn-outline" style={{flex: 1, justifyContent: 'center'}} onClick={() => setShowPatientModal(false)}>Cancel</button>
                                <button type="submit" className="ehr-btn ehr-btn-primary" style={{flex: 2, justifyContent: 'center'}}>Register & Prescribe</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {showStockModal && (
                <div className="ehr-modal-overlay" onClick={() => setShowStockModal(false)}>
                    <div className="ehr-form-modal" onClick={e => e.stopPropagation()}>
                        <div className="ehr-card-header" style={{border: 'none', padding: 0}}>
                            <h3 className="ehr-card-title">Add Inventory Stock</h3>
                        </div>
                        <form onSubmit={handleAddMed} style={{marginTop: '1.5rem'}}>
                            <div className="ehr-form-group">
                                <label className="ehr-form-label">Medicine Name</label>
                                <input required className="ehr-input" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                            </div>
                            <div className="ehr-form-group">
                                <label className="ehr-form-label">Category</label>
                                <input required placeholder="e.g. Antibiotic" className="ehr-input" value={newMed.category} onChange={e => setNewMed({...newMed, category: e.target.value})} />
                            </div>
                            <div style={{display: 'flex', gap: '1rem'}}>
                                <div className="ehr-form-group" style={{flex: 1}}>
                                    <label className="ehr-form-label">Stock Count</label>
                                    <input required type="number" className="ehr-input" value={newMed.stock} onChange={e => setNewMed({...newMed, stock: e.target.value})} />
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                                <button type="button" className="ehr-btn ehr-btn-outline" style={{flex: 1, justifyContent: 'center'}} onClick={() => setShowStockModal(false)}>Cancel</button>
                                <button type="submit" className="ehr-btn ehr-btn-primary" style={{flex: 2, justifyContent: 'center'}}>Add Stock</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DoctorDashboard;
