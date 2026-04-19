import React, { useState } from 'react';
import {
    Activity, Shield, Users, Lock,
    Database, Network, Cloud, ShieldCheck,
    AlertTriangle, Server, BarChart3, LogOut, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import './DoctorDashboard.css';

const AdminDashboard = () => {
    const { patients, prescriptions, medicines, logout } = useGlobal();
    const [view, setView] = useState('health'); // health, logs, users, infra

    return (
        <div className="dashboard-layout-professional">
            
            {/* Sidebar Navigation */}
            <aside className="ehr-sidebar" style={{ backgroundColor: '#0f172a' }}>
                <div className="ehr-brand" style={{ color: '#ffffff' }}>
                    <Server size={24} color="#f43f5e" />
                    <span>System Core</span>
                </div>
                
                <div className="ehr-nav">
                    <div className={`ehr-nav-item ${view === 'health' ? 'active' : ''}`} onClick={() => setView('health')}>
                        <Activity size={18} /> Platform Health
                    </div>
                    <div className={`ehr-nav-item ${view === 'logs' ? 'active' : ''}`} onClick={() => setView('logs')}>
                        <ShieldCheck size={18} /> Audit Logs
                        <span className="ehr-badge warning" style={{marginLeft: 'auto'}}>1</span>
                    </div>
                    <div className={`ehr-nav-item ${view === 'users' ? 'active' : ''}`} onClick={() => setView('users')}>
                        <Users size={18} /> Role Access
                    </div>
                    <div className={`ehr-nav-item ${view === 'infra' ? 'active' : ''}`} onClick={() => setView('infra')}>
                        <Network size={18} /> Infrastructure Info
                    </div>
                </div>

                <div style={{ marginTop: 'auto', padding: '0 1rem' }}>
                    <div className="ehr-nav-item" onClick={logout} style={{color: '#f87171'}}>
                        <LogOut size={18} /> Shutdown Feed
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ehr-main-content">
                
                {/* Header Bar */}
                <header className="ehr-header">
                    <div className="ehr-header-title">
                        {view === 'health' && 'Mainframe Integrity & Uptime'}
                        {view === 'logs' && 'Security Audit Trails'}
                        {view === 'users' && 'Data Sovereignty & Access'}
                        {view === 'infra' && 'Cloud Infrastructure Topology'}
                    </div>
                    <div className="ehr-header-actions">
                        <span style={{fontSize: '0.85rem', color: '#64748b', fontWeight: '600'}}>
                            Access Level: ROOT_SYSADMIN
                        </span>
                        {view === 'health' && (
                            <button className="ehr-btn ehr-btn-outline" style={{ color: '#f43f5e', borderColor: '#fda4af' }}>
                                <Shield size={16} /> Execute Deep Scan
                            </button>
                        )}
                    </div>
                </header>

                <div className="ehr-scroll-area">
                    
                    {/* View: PLATFORM HEALTH */}
                    {view === 'health' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}><Activity size={32} /></div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Core Stability</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>99.9% Uptime</h3>
                                    </div>
                                </div>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px' }}><Lock size={32} /></div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Encrypted Archives</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{prescriptions.length} Master Tokens</h3>
                                    </div>
                                </div>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '12px' }}><Users size={32} /></div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Global Users</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{patients.length} Nodes Ident</h3>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                {/* Resource Node A */}
                                <div className="ehr-card">
                                    <h3 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Database size={18} color="#f43f5e"/> Supabase PostgreSQL Node</h3>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                            <span>Read/Write Throughput</span><span>Active (82%)</span>
                                        </div>
                                        <div style={{ width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px' }}>
                                            <div style={{ width: '82%', background: '#3b82f6', height: '100%', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                            <span>Row Level Security (RLS) policies</span><span>Secure</span>
                                        </div>
                                        <div style={{ width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px' }}>
                                            <div style={{ width: '100%', background: '#10b981', height: '100%', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Resource Node B */}
                                <div className="ehr-card">
                                    <h3 style={{ margin: '0 0 1.5rem 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Cloud size={18} color="#8b5cf6"/> Elastic Storage Bucket (S3)</h3>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                            <span>Volume Capacity</span><span>4.2 TB / 10 TB</span>
                                        </div>
                                        <div style={{ width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px' }}>
                                            <div style={{ width: '42%', background: '#8b5cf6', height: '100%', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                            <span>Global CDN Sync</span><span>Online</span>
                                        </div>
                                        <div style={{ width: '100%', background: '#f1f5f9', height: '8px', borderRadius: '4px' }}>
                                            <div style={{ width: '100%', background: '#10b981', height: '100%', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* View: AUDIT LOGS */}
                    {view === 'logs' && (
                        <div className="ehr-card">
                            <div className="ehr-card-header">
                                <h3 className="ehr-card-title">Immutable Immutable Transactions</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { time: '14:22:15', user: 'SYS_CHEMIST', action: 'Digital Prescription Fulfilled', status: 'Success', color: 'success' },
                                    { time: '14:15:02', user: 'SYS_LABORATORY', action: 'Patient Biological Invoice Derived', status: 'Success', color: 'success' },
                                    { time: '13:55:40', user: 'SYSTEM_AUTON', action: 'BMR Automated DB Backup Snap', status: 'Success', color: 'success' },
                                    { time: '13:42:12', user: 'SYS_PHYSICIAN', action: 'Access Blocked Due to JWT Expiry', status: 'Terminated', color: 'warning' },
                                    { time: '13:10:05', user: 'UNKNOWN PORT', action: 'Ingress Port Scan Deflected', status: 'Critical', color: 'danger' },
                                ].map((log, i) => (
                                    <div key={i} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace', width: '80px' }}>{log.time}</span>
                                        <span style={{ fontWeight: 600, color: '#0f172a', width: '150px' }}>{log.user}</span>
                                        <span style={{ flex: 1, color: '#334155' }}>{log.action}</span>
                                        <span className={`ehr-badge ${log.color}`}>{log.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View: ROLE ACCESS */}
                    {view === 'users' && (
                        <div className="ehr-card">
                            <div className="ehr-card-header">
                                <h3 className="ehr-card-title">Data Sovereignty Node Map</h3>
                            </div>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>All cross-system queries are actively gated by Supabase RLS (Row Level Security) enforcing role-based limits.</p>
                            
                            <table className="ehr-table" style={{ width: '100%', marginBottom: '2rem' }}>
                                <thead>
                                    <tr>
                                        <th>Node Persona</th>
                                        <th>Granted RLS Capabilities</th>
                                        <th>Restricted Spaces</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Physician</strong></td>
                                        <td><span className="ehr-badge info">Read (All Patients)</span> <span className="ehr-badge success">Write (Prescriptions)</span></td>
                                        <td style={{ color: '#ef4444' }}>Wholesale Matrix, Logs</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Patient</strong></td>
                                        <td><span className="ehr-badge info">Read (Self records ONLY)</span></td>
                                        <td style={{ color: '#ef4444' }}>Other user rows globally</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Pharmacist</strong></td>
                                        <td><span className="ehr-badge info">Read (Inventory)</span> <span className="ehr-badge success">Write (Stock counts)</span></td>
                                        <td style={{ color: '#ef4444' }}>Admin overrides, Lab nodes</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Laboratory</strong></td>
                                        <td><span className="ehr-badge info">Write (Sample Uploads)</span> <span className="ehr-badge info">Read (Queues)</span></td>
                                        <td style={{ color: '#ef4444' }}>Everything outside pathology</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* View: INFRA */}
                    {view === 'infra' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="ehr-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <Database size={48} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                                <h3>Backend Service</h3>
                                <p style={{ color: '#64748b' }}>PostgreSQL 15 via Supabase Edge</p>
                            </div>
                            <div className="ehr-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                                <h3>Network Integrity</h3>
                                <p style={{ color: '#64748b' }}>Awaits cluster rebalance on Node 2.</p>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
