import React from 'react';
import {
    Users, Shield, Activity, Lock,
    Search, Filter, CheckCircle2, AlertTriangle,
    Settings, Database, Cloud, FileText,
    Terminal, BarChart3, ShieldCheck
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { patients, prescriptions, medicines } = useGlobal();

    return (
        <div className="dashboard-fade">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-main)' }}>
                <div>
                    <h1>System Core Administration</h1>
                    <p className="subtitle">Global infrastructure, security protocols, and medical data integrity.</p>
                </div>
                <div className="header-actions">
                    <button className="secondary-btn glass">
                        <Terminal size={18} />
                        <span>Console</span>
                    </button>
                    <button className="primary-btn pulse-btn">
                        <ShieldAlert size={18} />
                        <span>Security Scan</span>
                    </button>
                </div>
            </header>

            <section className="stats-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="stat-card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '24px' }}>
                    <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary)', padding: '12px', borderRadius: '14px' }}><Activity size={24} /></div>
                    <div>
                        <p className="subtitle">Core Stability</p>
                        <h3 className="stat-value">99.9% Uptime</h3>
                    </div>
                </div>
                <div className="stat-card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '24px' }}>
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '12px', borderRadius: '14px' }}><Lock size={24} /></div>
                    <div>
                        <p className="subtitle">Encrypted Archives</p>
                        <h3 className="stat-value">{prescriptions.length} Records</h3>
                    </div>
                </div>
                <div className="stat-card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '24px' }}>
                    <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', padding: '12px', borderRadius: '14px' }}><Users size={24} /></div>
                    <div>
                        <p className="subtitle">Identity Registry</p>
                        <h3 className="stat-value">{patients.length} Profiles</h3>
                    </div>
                </div>
            </section>

            <div className="admin-grid">
                <section className="audit-logs glass col-left">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div className="header-with-icon">
                            <ShieldCheck size={24} color="var(--primary)" />
                            <h2>Security Audit Logs</h2>
                        </div>
                        <button className="secondary-btn glass">Download Audit</button>
                    </div>

                    <div className="log-entries">
                        {[
                            { time: '14:22:15', user: 'Dr. Smith', action: 'Digital Prescription Issued', status: 'Success' },
                            { time: '14:15:02', user: 'Lab Admin', action: 'PCR Assay Result Uploaded', status: 'Success' },
                            { time: '13:55:40', user: 'System Context', action: 'BMR Automated DB Backup', status: 'Success' },
                            { time: '13:42:12', user: 'Pharmacy Node', action: 'Inventory Depletion Alert', status: 'Success' },
                            { time: '13:10:05', user: 'Unauthorized Node', action: 'Port Scan Deflected', status: 'Security' },
                        ].map((log, i) => (
                            <div key={i} className="log-entry glass">
                                <span className="log-time">{log.time}</span>
                                <span className="log-user">{log.user}</span>
                                <p className="log-action">{log.action}</p>
                                <span className={`log-status ${log.status.toLowerCase()}`}>{log.status}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="platform-health col-right">
                    <div className="health-card glass">
                        <h3>Mainframe Integrity</h3>
                        <div className="health-bar">
                            <div className="fill" style={{ width: '85%' }}></div>
                        </div>
                        <div className="health-details">
                            <span className="subtitle uppercase">Postgres Node A</span>
                            <span className="status green uppercase">Verified</span>
                        </div>
                    </div>

                    <div className="health-card glass">
                        <h3>Elastic Storage Cache</h3>
                        <div className="health-bar">
                            <div className="fill" style={{ width: '42%', background: 'var(--secondary)' }}></div>
                        </div>
                        <div className="health-details">
                            <span className="subtitle uppercase">S3 Object Store</span>
                            <span className="status uppercase">4.2 TB / 10 TB</span>
                        </div>
                    </div>

                    <div className="infra-grid">
                        <div className="infra-item glass">
                            <Database size={20} color="var(--primary)" />
                            <span>Postgres</span>
                        </div>
                        <div className="infra-item glass">
                            <Cloud size={20} color="var(--secondary)" />
                            <span>Supabase</span>
                        </div>
                        <div className="infra-item glass">
                            <Shield size={20} color="var(--primary)" />
                            <span>RLS 2.0</span>
                        </div>
                        <div className="infra-item glass">
                            <BarChart3 size={20} color="var(--secondary)" />
                            <span>Vitals API</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const ShieldAlert = Shield;

export default AdminDashboard;
