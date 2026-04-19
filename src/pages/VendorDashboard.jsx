import React, { useState } from 'react';
import {
    Bed, Calendar, Truck, Wrench, 
    BadgeDollarSign, Package, Search, Plus,
    Clock, CheckCircle, AlertCircle, LogOut,
    ChevronRight, MapPin, Settings, Info,
    User, FileText, Printer, BarChart3
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../data/mock';
import './DoctorDashboard.css';

const VendorDashboard = () => {
    const { profile, logout } = useGlobal();
    const [view, setView] = useState('catalog'); // catalog, scheduler, logistics, maintenance, finance

    // Mock Data for Rental features
    const [assets, setAssets] = useState([
        { id: 'AST001', name: 'Standard Hospital Bed', category: 'Patient Care', stock: 15, available: 4, rate: 25 },
        { id: 'AST002', name: 'Electric Wheelchair', category: 'Mobility', stock: 10, available: 2, rate: 45 },
        { id: 'AST003', name: 'Oxygen Concentrator', category: 'Respiratory', stock: 20, available: 8, rate: 35 },
        { id: 'AST004', name: 'Patient Lift', category: 'Mobility', stock: 5, available: 1, rate: 60 },
        { id: 'AST005', name: 'CPAP Machine', category: 'Respiratory', stock: 12, available: 6, rate: 20 },
    ]);

    const [activeRentals, setActiveRentals] = useState([
        { id: 'RN4082', patient: 'James Wilson', item: 'Hospital Bed', due: 'Oct 25, 2024', status: 'Delivered' },
        { id: 'RN4083', patient: 'Sarah Connor', item: 'Oxygen Concentrator', due: 'Nov 02, 2024', status: 'Pending Delivery' },
        { id: 'RN4084', patient: 'Robert Smith', item: 'Electric Wheelchair', due: 'Oct 22, 2024', status: 'Pickup Scheduled' },
    ]);

    const [maintenanceJobs, setMaintenanceJobs] = useState([
        { id: 'MN102', item: 'Electric Wheelchair (ID: AST002-3)', task: 'Battery Calibration', priority: 'High', status: 'In Progress' },
        { id: 'MN103', item: 'Oxygen Concentrator (ID: AST003-8)', task: 'Filter Replacement', priority: 'Medium', status: 'Scheduled' },
    ]);

    return (
        <div className="dashboard-layout-professional">
            
            {/* Sidebar Navigation */}
            <aside className="ehr-sidebar" style={{ backgroundColor: '#0f172a' }}>
                <div className="ehr-brand" style={{ color: '#ffffff' }}>
                    <Truck size={24} color="#3b82f6" />
                    <span>MedRent Ops</span>
                </div>
                
                <div className="ehr-nav">
                    <div className={`ehr-nav-item ${view === 'catalog' ? 'active' : ''}`} onClick={() => setView('catalog')}>
                        <Package size={18} /> Asset Catalog
                    </div>
                    <div className={`ehr-nav-item ${view === 'scheduler' ? 'active' : ''}`} onClick={() => setView('scheduler')}>
                        <Calendar size={18} /> Availability Scheduler
                        <span className="ehr-badge info" style={{marginLeft: 'auto'}}>4</span>
                    </div>
                    <div className={`ehr-nav-item ${view === 'logistics' ? 'active' : ''}`} onClick={() => setView('logistics')}>
                        <Truck size={18} /> Logistics & Dispatch
                    </div>
                    <div className={`ehr-nav-item ${view === 'maintenance' ? 'active' : ''}`} onClick={() => setView('maintenance')}>
                        <Wrench size={18} /> Tech Support / Maintenance
                        <span className="ehr-badge warning" style={{marginLeft: 'auto'}}>{maintenanceJobs.length}</span>
                    </div>
                    <div className={`ehr-nav-item ${view === 'finance' ? 'active' : ''}`} onClick={() => setView('finance')}>
                        <BadgeDollarSign size={18} /> Deposits & Billing
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
                        {view === 'catalog' && 'Equipment Asset Catalog Management'}
                        {view === 'scheduler' && 'Real-Time Availability & Reservations'}
                        {view === 'logistics' && 'Fleet Management: Delivery & Pickup'}
                        {view === 'maintenance' && 'Maintenance Log & Technical Monitoring'}
                        {view === 'finance' && 'Financial Ledger: Deposits & Invoicing'}
                    </div>
                    <div className="ehr-header-actions">
                        <span style={{fontSize: '0.85rem', color: '#64748b', fontWeight: '600'}}>
                            Vendor Node: EQ-{profile?.id?.substring(0,8).toUpperCase() || 'VEND-01'}
                        </span>
                        {view === 'catalog' && (
                            <button className="ehr-btn ehr-btn-primary">
                                <Plus size={16} /> Register New Equipment
                            </button>
                        )}
                    </div>
                </header>

                <div className="ehr-scroll-area" style={{ backgroundColor: '#f8fafc' }}>
                    
                    {/* View: ASSET CATALOG */}
                    {view === 'catalog' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px' }}><Package size={32} /></div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Total Inventory</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>62 Units</h3>
                                    </div>
                                </div>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}><CheckCircle size={32} /></div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Active Rentals</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>41 Deployments</h3>
                                    </div>
                                </div>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px' }}><AlertCircle size={32} /></div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Down for Service</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>5 Units</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="ehr-card">
                                <div className="ehr-card-header">
                                    <h3 className="ehr-card-title">Bio-Medical Equipment Matrix</h3>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
                                        <input type="text" placeholder="Filter equipment..." className="ehr-input" style={{ paddingLeft: '2rem', width: '300px' }} />
                                    </div>
                                </div>
                                <div className="ehr-table-wrapper">
                                    <table className="ehr-table">
                                        <thead>
                                            <tr>
                                                <th>Ref ID</th>
                                                <th>Equipment Name</th>
                                                <th>Category</th>
                                                <th>Deployment Status</th>
                                                <th>Base Rate/Day</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assets.map(asset => (
                                                <tr key={asset.id}>
                                                    <td style={{fontFamily: 'monospace', color: '#64748b'}}>{asset.id}</td>
                                                    <td>
                                                        <strong style={{ color: '#0f172a', display: 'block' }}>{asset.name}</strong>
                                                    </td>
                                                    <td><span className="ehr-badge info">{asset.category}</span></td>
                                                    <td>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <div style={{ width: '100%', background: '#f1f5f9', height: '6px', borderRadius: '3px' }}>
                                                                <div style={{ width: `${(asset.stock - asset.available) / asset.stock * 100}%`, background: '#3b82f6', height: '100%', borderRadius: '3px' }}></div>
                                                            </div>
                                                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{asset.available} of {asset.stock} Available</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>{formatCurrency(asset.rate)}</td>
                                                    <td>
                                                        <button className="ehr-btn ehr-btn-outline" style={{ padding: '0.4rem 0.6rem' }}>Details</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View: SCHEDULER */}
                    {view === 'scheduler' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="ehr-card">
                                <div className="ehr-card-header">
                                    <h3 className="ehr-card-title">Upcoming Reservations Queue</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {activeRentals.filter(r => r.status === 'Pending Delivery').map(rent => (
                                        <div key={rent.id} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span className="ehr-badge warning">Reservation Target</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Due: {rent.due}</span>
                                                </div>
                                                <h4 style={{ margin: '0.5rem 0', fontSize: '1.1rem', color: '#0f172a' }}>{rent.item}</h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Reserved by: {rent.patient}</p>
                                            </div>
                                            <button className="ehr-btn ehr-btn-primary">Schedule Logistics</button>
                                        </div>
                                    ))}
                                    <div style={{border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#64748b'}}>
                                        <Calendar size={32} style={{margin: '0 auto 1rem autof'}} />
                                        <p>No other immediate conflicts in the 48-hour scheduler.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View: LOGISTICS */}
                    {view === 'logistics' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                             <div className="ehr-card" style={{ background: '#0f172a', color: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <Truck color="#3b82f6" />
                                    <h2 style={{ margin: 0, color: 'white' }}>Fleet Management Console</h2>
                                </div>
                                <p style={{ margin: 0, color: '#94a3b8' }}>Real-time coordination of doorstep delivery and retrieval of biomedical assets.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="ehr-card">
                                    <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} color="#3b82f6"/> Active Deliveries</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {activeRentals.filter(r => r.status === 'Pending Delivery').map(r => (
                                            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{r.patient}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.item}</div>
                                                </div>
                                                <span className="ehr-badge warning">In Transit</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="ehr-card">
                                    <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} color="#8b5cf6"/> Scheduled Pickups</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {activeRentals.filter(r => r.status === 'Pickup Scheduled').map(r => (
                                            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{r.patient}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.item}</div>
                                                </div>
                                                <span className="ehr-badge info">Assigned</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View: MAINTENANCE */}
                    {view === 'maintenance' && (
                        <div className="ehr-card">
                            <div className="ehr-card-header">
                                <h3 className="ehr-card-title">Technical Support & Sanitization Log</h3>
                            </div>
                            <div className="ehr-table-wrapper">
                                <table className="ehr-table">
                                    <thead>
                                        <tr>
                                            <th>Job-ID</th>
                                            <th>Asset Context</th>
                                            <th>Maintenance Protocol</th>
                                            <th>Urgency</th>
                                            <th>Operational Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {maintenanceJobs.map(job => (
                                            <tr key={job.id}>
                                                <td style={{fontFamily: 'monospace'}}>{job.id}</td>
                                                <td>{job.item}</td>
                                                <td>{job.task}</td>
                                                <td><span className={`ehr-badge ${job.priority === 'High' ? 'danger' : 'warning'}`}>{job.priority}</span></td>
                                                <td><span className="ehr-badge info">{job.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* View: FINANCE */}
                    {view === 'finance' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                <div className="ehr-card">
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem' }}>Uncollected Invoices</h4>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>$4,250.00</div>
                                </div>
                                <div className="ehr-card">
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem' }}>Held Security Deposits</h4>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>$12,800.00</div>
                                </div>
                                <div className="ehr-card">
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem' }}>Monthly Revenue (Projected)</h4>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>$28,400.00</div>
                                </div>
                            </div>

                            <div className="ehr-card">
                                <div className="ehr-card-header">
                                    <h3 className="ehr-card-title">Financial Ledger & Invoicing</h3>
                                    <button className="ehr-btn ehr-btn-outline"><Printer size={16} /> Print Report</button>
                                </div>
                                <div className="ehr-table-wrapper">
                                    <table className="ehr-table">
                                        <thead>
                                            <tr>
                                                <th>Reference</th>
                                                <th>Patient / Client</th>
                                                <th>Deposit Status</th>
                                                <th>Total Owed</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>#F-9021</td>
                                                <td>Alice Freeman</td>
                                                <td><span className="ehr-badge success">Verified Collected</span></td>
                                                <td style={{ fontWeight: 600 }}>$350.00</td>
                                                <td><button className="ehr-btn ehr-btn-outline" style={{ padding: '0.3rem 0.6rem' }}><FileText size={14} /></button></td>
                                            </tr>
                                            <tr>
                                                <td>#F-9022</td>
                                                <td>Kevin Malone</td>
                                                <td><span className="ehr-badge warning">Pending Hold</span></td>
                                                <td style={{ fontWeight: 600 }}>$840.00</td>
                                                <td><button className="ehr-btn ehr-btn-outline" style={{ padding: '0.3rem 0.6rem' }}><FileText size={14} /></button></td>
                                            </tr>
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

export default VendorDashboard;
