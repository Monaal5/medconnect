import React, { useState } from 'react';
import {
    Package, Bell, CheckCircle, FileText,
    TrendingUp, Truck, Plus, Search,
    AlertCircle, LogOut, Pill, Info, Activity,
    Save, X, ShoppingBag, BadgeDollarSign, Bot, Printer
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../data/mock';
import './DoctorDashboard.css'; /* Reuse exact clinical UI styling */

const ChemistDashboard = () => {
    const { profile, medicines, prescriptions, addMedicine, updateStock, logout } = useGlobal();
    const [view, setView] = useState('inventory'); // inventory, inquiries, fulfillment, analytics, wholesale, billing
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Inventory edit state
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [newMed, setNewMed] = useState({ name: '', category: '', stock: '', price: '' });

    // AI Invoice Generator State
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState('');
    const [generatedInvoice, setGeneratedInvoice] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const lowStock = medicines.filter(m => m.stock < 20);
    const totalStockValue = medicines.reduce((acc, current) => acc + ((current.price || 0) * (current.stock || 0)), 0);

    const handleEditStock = (med) => {
        setEditingId(med.id);
        setEditValue(med.stock);
    };

    const handleSaveStock = (id) => {
        updateStock(id, 'stock', parseInt(editValue));
        setEditingId(null);
    };

    const handleAddMed = async (e) => {
        e.preventDefault();
        await addMedicine(newMed);
        setShowAddModal(false);
        setNewMed({ name: '', category: '', stock: '', price: '' });
    };

    const handleAIGenerateInvoice = () => {
        if (!selectedPrescriptionId) return;
        setIsGenerating(true);
        setGeneratedInvoice(null);
        
        // Mocking an AI delay to parse records and calculate pharmaceutical sums
        setTimeout(() => {
            // Find prescription by patient name or ID
            const targetPrescription = prescriptions.find(p => p.patient_name.toLowerCase() === selectedPrescriptionId.toLowerCase() || p.id === selectedPrescriptionId);
            
            if (!targetPrescription) {
                alert("No active prescription records found for this patient name/ID.");
                setIsGenerating(false);
                return;
            }

            // Map the prescribed medicines to their database prices, or fallback
            const resolvedItems = targetPrescription.medicines.map(prescMed => {
                const dbMed = medicines.find(m => m.name.toLowerCase() === prescMed.name.toLowerCase());
                const unitPrice = dbMed ? dbMed.price : 45.00; // Fake fallback amount if drug not tracked
                return { 
                    name: `${prescMed.name} (${prescMed.dosage})`, 
                    date: targetPrescription.date, 
                    amount: unitPrice 
                };
            });

            const subtotal = resolvedItems.reduce((acc, curr) => acc + curr.amount, 0);
            const gst = subtotal * 0.18; // standard pharmaceutical GST mock
            
            setGeneratedInvoice({
                patientName: targetPrescription.patient_name,
                physician: targetPrescription.doctor,
                invoiceNumber: `PH-INV-${Math.floor(Math.random() * 90000) + 10000}`,
                date: new Date().toLocaleDateString(),
                items: resolvedItems,
                subtotal: subtotal,
                tax: gst,
                total: subtotal + gst
            });
            setIsGenerating(false);
        }, 1500);
    };

    const handlePrintPDF = () => {
        window.print();
    };


    return (
        <div className="dashboard-layout-professional">
            
            {/* Sidebar Navigation */}
            <aside className="ehr-sidebar print-hidden" style={{ backgroundColor: '#0f172a' }}>
                <div className="ehr-brand" style={{ color: '#ffffff' }}>
                    <Pill size={24} color="#8b5cf6" />
                    <span>PharmaLink</span>
                </div>
                
                <div className="ehr-nav">
                    <div className={`ehr-nav-item ${view === 'inventory' ? 'active' : ''}`} onClick={() => setView('inventory')}>
                        <Package size={18} /> Inventory Control
                        {lowStock.length > 0 && <span className="ehr-badge warning" style={{marginLeft: 'auto'}}>{lowStock.length}</span>}
                    </div>
                    <div className={`ehr-nav-item ${view === 'inquiries' ? 'active' : ''}`} onClick={() => setView('inquiries')}>
                        <Bell size={18} /> Inquiry Radar
                        <span className="ehr-badge info" style={{marginLeft: 'auto'}}>3</span>
                    </div>
                    <div className={`ehr-nav-item ${view === 'fulfillment' ? 'active' : ''}`} onClick={() => setView('fulfillment')}>
                        <FileText size={18} /> Rx Fulfillment
                    </div>
                    <div className={`ehr-nav-item ${view === 'billing' ? 'active' : ''}`} onClick={() => setView('billing')}>
                        <BadgeDollarSign size={18} /> AI Invoice & GST
                    </div>
                    <div className={`ehr-nav-item ${view === 'analytics' ? 'active' : ''}`} onClick={() => setView('analytics')}>
                        <TrendingUp size={18} /> Analytics Maps
                    </div>
                    <div className={`ehr-nav-item ${view === 'wholesale' ? 'active' : ''}`} onClick={() => setView('wholesale')}>
                        <Truck size={18} /> Supply Chain
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
                <header className="ehr-header print-hidden">
                    <div className="ehr-header-title">
                        {view === 'inventory' && 'Comprehensive Inventory Control'}
                        {view === 'inquiries' && 'Medication Inquiry & Availability'}
                        {view === 'fulfillment' && 'Digital Prescription Fulfillment'}
                        {view === 'billing' && 'Automated Billing & Digital Invoice Generation'}
                        {view === 'analytics' && 'Demand Forecasting & Analytics'}
                        {view === 'wholesale' && 'Wholesale Supply Chain Integration'}
                    </div>
                    <div className="ehr-header-actions">
                        <span style={{fontSize: '0.85rem', color: '#64748b', fontWeight: '600'}}>
                            Retailer Node: PH-{profile?.id?.substring(0,6).toUpperCase()}
                        </span>
                        {view === 'inventory' && (
                            <button className="ehr-btn ehr-btn-primary" onClick={() => setShowAddModal(true)}>
                                <Plus size={16} /> Register New Pharmaceutical
                            </button>
                        )}
                    </div>
                </header>

                <div className="ehr-scroll-area">
                    
                    {/* View: INVENTORY CONTROL */}
                    {view === 'inventory' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '12px' }}><ShoppingBag size={32} /></div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Total Value</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{formatCurrency(totalStockValue)}</h3>
                                    </div>
                                </div>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px' }}><Package size={32} /></div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Active SKUs</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{medicines.length} Types</h3>
                                    </div>
                                </div>
                                <div className="ehr-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: 0 }}>
                                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '12px' }}><AlertCircle size={32} /></div>
                                    <div>
                                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Low Stock Alerts</p>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a' }}>{lowStock.length} Warnings</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Inventory Table */}
                            <div className="ehr-card">
                                <div className="ehr-card-header">
                                    <h3 className="ehr-card-title">Real-Time Stock Repository</h3>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }} />
                                        <input type="text" placeholder="Search drug formula..." className="ehr-input" style={{ paddingLeft: '2rem', width: '300px' }} />
                                    </div>
                                </div>
                                <div className="ehr-table-wrapper">
                                    <table className="ehr-table">
                                        <thead>
                                            <tr>
                                                <th>Pharmaceutical</th>
                                                <th>Category</th>
                                                <th>Unit Retail Price</th>
                                                <th>Current Stock Level</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {medicines.map(med => (
                                                <tr key={med.id}>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                            <div style={{ background: '#f1f5f9', padding: '6px', borderRadius: '6px' }}><Pill size={16} color="#64748b" /></div>
                                                            <strong style={{ color: '#0f172a' }}>{med.name}</strong>
                                                        </div>
                                                    </td>
                                                    <td><span className="ehr-badge info">{med.category || 'General'}</span></td>
                                                    <td style={{ fontWeight: 600 }}>{formatCurrency(med.price || 0)}</td>
                                                    <td>
                                                        {editingId === med.id ? (
                                                            <input type="number" className="ehr-input" value={editValue} onChange={(e) => setEditValue(e.target.value)} style={{ width: '80px', padding: '4px' }} autoFocus />
                                                        ) : (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <span className={med.stock < 20 ? 'ehr-badge warning' : ''} style={{ fontWeight: med.stock < 20 ? 700 : 500 }}>
                                                                    {med.stock} Units {med.stock < 20 && '(LOW)'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editingId === med.id ? (
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                <button className="ehr-btn ehr-btn-primary" style={{ padding: '0.3rem 0.6rem' }} onClick={() => handleSaveStock(med.id)}><Save size={14} /></button>
                                                                <button className="ehr-btn ehr-btn-outline" style={{ padding: '0.3rem 0.6rem' }} onClick={() => setEditingId(null)}><X size={14} /></button>
                                                            </div>
                                                        ) : (
                                                            <button className="ehr-btn ehr-btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleEditStock(med)}>
                                                                Adjust Count
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* View: MEDICATION INQUIRIES */}
                    {view === 'inquiries' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="ehr-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <Bell color="#3b82f6" />
                                    <h2 style={{ margin: 0, color: '#0f172a' }}>Live Inquiry Radar</h2>
                                </div>
                                <p style={{ margin: 0, color: '#64748b' }}>Immediately notifies you when physicians or patients within a 5-mile radius query pharmaceutical availability.</p>
                            </div>

                            <div className="ehr-card">
                                <h3 className="ehr-card-title" style={{ marginBottom: '1.5rem' }}>Pending Availability Confirmations</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {[
                                        { from: 'Dr. Elena Rostova', drug: 'Amoxicillin 500mg', qty: 30, time: '2m ago' },
                                        { from: 'Patient Request via App', drug: 'Lisinopril 10mg', qty: 90, time: '14m ago' },
                                        { from: 'City General ER', drug: 'Epinephrine Auto-Injector', qty: 5, time: '1h ago' }
                                    ].map((inq, idx) => (
                                        <div key={idx} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: idx === 0 ? '#eff6ff' : 'white' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span className="ehr-badge info">Incoming Query</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{inq.time}</span>
                                                </div>
                                                <h4 style={{ margin: '0.5rem 0', fontSize: '1.1rem', color: '#0f172a' }}>{inq.drug} <span style={{ fontWeight: 400, color: '#64748b' }}>x{inq.qty} requested</span></h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Source: {inq.from}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="ehr-btn ehr-btn-outline" style={{ color: '#ef4444', borderColor: '#fca5a5' }}>Decline (Out of Stock)</button>
                                                <button className="ehr-btn ehr-btn-primary"><CheckCircle size={16} /> Confirm Availability</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}


                    {/* View: DIGITAL PRESCRIPTION FULFILLMENT */}
                    {view === 'fulfillment' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="ehr-card">
                                <div className="ehr-card-header">
                                    <h3 className="ehr-card-title">Digital Fulfillment Queue</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                                    {prescriptions.map((pres, idx) => (
                                        <div key={idx} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <span className="ehr-badge warning">Pending Preparation</span>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{pres.date}</span>
                                            </div>
                                            <h4 style={{ margin: '0 0 0.2rem 0', color: '#0f172a' }}>Patient: {pres.patient_name}</h4>
                                            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b' }}>Prescriber: {pres.doctor}</p>
                                            
                                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                                <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block', marginBottom: '0.5rem' }}>Drug Regimen:</strong>
                                                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#334155' }}>
                                                    {pres.medicines.map((m, i) => (
                                                        <li key={i}>{m.name} - {m.dosage} ({m.timing})</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="ehr-btn ehr-btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setSelectedPrescriptionId(pres.patient_name); setView('billing'); }}>
                                                    Generate Bill
                                                </button>
                                                <button className="ehr-btn ehr-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                                    <CheckCircle size={16} /> Mark Ready
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {prescriptions.length === 0 && (
                                        <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                            <CheckCircle size={48} color="#10b981" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                            <h3>All Queue Clear</h3>
                                            <p>No pending prescriptions require fulfillment at this time.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}


                    {/* View: AI INVOICE GENERATOR & PDF */}
                    {view === 'billing' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                            {/* Generator Controls (Hidden when printing via CSS) */}
                            <div className="ehr-card print-hidden" style={{ width: '100%', maxWidth: '800px', background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <Bot size={32} color="#8b5cf6" />
                                    <div>
                                        <h2 style={{ margin: 0, color: 'white' }}>Automated Billing Operator</h2>
                                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Pharmaceutical sum calculations and GST integration for Patient Prescriptions.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Enter exact Patient Name to compile invoice..." 
                                        className="ehr-input" 
                                        style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                                        value={selectedPrescriptionId}
                                        onChange={e => setSelectedPrescriptionId(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleAIGenerateInvoice()}
                                    />
                                    <button className="ehr-btn ehr-btn-primary" onClick={handleAIGenerateInvoice} disabled={isGenerating}>
                                        {isGenerating ? 'Synthesizing...' : 'Generate Invoice Sum'}
                                    </button>
                                </div>
                            </div>

                            {/* Rendered Invoice Section - This acts as the payload for PDF generation */}
                            {generatedInvoice && (
                                <div className="ehr-card printable-invoice" style={{ width: '100%', maxWidth: '800px', padding: '3rem', position: 'relative' }}>
                                    <div className="print-hidden" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                                        <button className="ehr-btn ehr-btn-outline" onClick={handlePrintPDF} style={{ background: '#0f172a', color: 'white' }}>
                                            <Printer size={16} style={{marginRight: '8px'}} /> Expert to PDF
                                        </button>
                                    </div>

                                    {/* Invoice Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                                        <div>
                                            <h1 style={{ margin: 0, color: '#0f172a', fontSize: '2rem' }}>TAX INVOICE</h1>
                                            <p style={{ margin: 0, color: '#64748b' }}>PharmaLink Retail Pharmacy</p>
                                            <p style={{ margin: 0, color: '#64748b' }}>GSTIN: 22AAAAA0000A1Z5</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0f172a' }}>{generatedInvoice.invoiceNumber}</strong>
                                            <p style={{ margin: 0, color: '#64748b' }}>Date: {generatedInvoice.date}</p>
                                        </div>
                                    </div>

                                    {/* Bill To */}
                                    <div style={{ marginBottom: '2.5rem' }}>
                                        <strong style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Dispensed To:</strong>
                                        <h3 style={{ margin: '0.2rem 0', color: '#0f172a' }}>{generatedInvoice.patientName}</h3>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Prescribing Physician: {generatedInvoice.physician}</p>
                                    </div>

                                    {/* Items Table */}
                                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                                <th style={{ textAlign: 'left', padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>PHARMACEUTICAL</th>
                                                <th style={{ textAlign: 'left', padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>DATE</th>
                                                <th style={{ textAlign: 'right', padding: '1rem', color: '#475569', fontSize: '0.9rem' }}>AMOUNT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {generatedInvoice.items.map((item, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                    <td style={{ padding: '1rem', color: '#0f172a', fontWeight: 500 }}>{item.name}</td>
                                                    <td style={{ padding: '1rem', color: '#64748b' }}>{item.date}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Calculations */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <div style={{ width: '300px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#64748b' }}>
                                                <span>Subtotal</span>
                                                <span>{formatCurrency(generatedInvoice.subtotal)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                                                <span>AI Tax Matrix (GST 18%)</span>
                                                <span>{formatCurrency(generatedInvoice.tax)}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: 700 }}>
                                                <span>Total Amount</span>
                                                <span>{formatCurrency(generatedInvoice.total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div style={{ marginTop: '4rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                        <p>Medicines once sold cannot be returned.</p>
                                        <p>Valid digital signature attached. Powered by Auto-Billing.</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}


                    {/* View: DEMAND FORECASTING */}
                    {view === 'analytics' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="ehr-card">
                                <div className="ehr-card-header">
                                    <h3 className="ehr-card-title">Demand Forecasting Array</h3>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
                                    Algorithmic predictions of upcoming pharmaceutical requirements based on local clinic epidemiological data and historical seasonal shifts.
                                </p>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ display: 'block', color: '#0f172a', marginBottom: '0.3rem' }}>Allergy Therapeutics (Antihistamines)</strong>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Projected 45% increase in demand next month due to early pollen data.</p>
                                        </div>
                                        <div style={{ flex: 1, background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                                            <div style={{ width: '85%', background: '#ef4444', height: '100%' }}></div>
                                        </div>
                                        <div style={{ width: '80px', textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>Critical</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ display: 'block', color: '#0f172a', marginBottom: '0.3rem' }}>Pediatric Analgesics</strong>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Stable growth trajectory correlating with local school openings.</p>
                                        </div>
                                        <div style={{ flex: 1, background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                                            <div style={{ width: '45%', background: '#f59e0b', height: '100%' }}></div>
                                        </div>
                                        <div style={{ width: '80px', textAlign: 'right', fontWeight: 700, color: '#f59e0b' }}>Monitor</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ display: 'block', color: '#0f172a', marginBottom: '0.3rem' }}>Broad-Spectrum Antibiotics</strong>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>No unusual activity detected.</p>
                                        </div>
                                        <div style={{ flex: 1, background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                                            <div style={{ width: '15%', background: '#10b981', height: '100%' }}></div>
                                        </div>
                                        <div style={{ width: '80px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>Stable</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* View: WHOLESALE SUPPLY */}
                    {view === 'wholesale' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="ehr-card" style={{ background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <Truck size={32} color="#8b5cf6" />
                                    <h2 style={{ margin: 0, color: 'white' }}>Supply Chain Integration</h2>
                                </div>
                                <p style={{ margin: 0, color: '#94a3b8' }}>Direct B2B interface with accredited regional distributors for one-click stock replenishment.</p>
                            </div>

                            <div className="ehr-card">
                                <h3 className="ehr-card-title">Available Distributors</h3>
                                <div className="ehr-table-wrapper">
                                    <table className="ehr-table">
                                        <thead>
                                            <tr>
                                                <th>Distributor Node</th>
                                                <th>Rating / Delivery Speed</th>
                                                <th>Min Order Requirement</th>
                                                <th>Catalog Integration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><strong style={{ color: '#0f172a' }}>National PharmaLogistics</strong></td>
                                                <td>4.9⭐ • Standard (2-Day)</td>
                                                <td>$5,000</td>
                                                <td><button className="ehr-btn ehr-btn-outline" style={{ fontSize: '0.8rem' }}>Browse Catalog</button></td>
                                            </tr>
                                            <tr>
                                                <td><strong style={{ color: '#0f172a' }}>Regional MedSupply Inc.</strong></td>
                                                <td>4.5⭐ • Express (Next Day)</td>
                                                <td>$1,500</td>
                                                <td><button className="ehr-btn ehr-btn-outline" style={{ fontSize: '0.8rem' }}>Browse Catalog</button></td>
                                            </tr>
                                            <tr>
                                                <td><strong style={{ color: '#0f172a' }}>Apex Biosynthetics</strong></td>
                                                <td>4.8⭐ • Specialized API</td>
                                                <td>$10,000</td>
                                                <td><button className="ehr-btn ehr-btn-outline" style={{ fontSize: '0.8rem' }}>Browse Catalog</button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Add Stock Modal */}
            {showAddModal && (
                <div className="ehr-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="ehr-form-modal" onClick={e => e.stopPropagation()}>
                        <div className="ehr-card-header" style={{border: 'none', padding: 0}}>
                            <h3 className="ehr-card-title">Register Drug to Inventory</h3>
                        </div>
                        <form onSubmit={handleAddMed} style={{marginTop: '1.5rem'}}>
                            <div className="ehr-form-group">
                                <label className="ehr-form-label">Pharmaceutical Name / Formula</label>
                                <input required className="ehr-input" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                            </div>
                            <div className="ehr-form-group">
                                <label className="ehr-form-label">Classification Segment</label>
                                <input required placeholder="e.g. Schedule H, OTC, Analgesic" className="ehr-input" value={newMed.category} onChange={e => setNewMed({...newMed, category: e.target.value})} />
                            </div>
                            <div style={{display: 'flex', gap: '1rem'}}>
                                <div className="ehr-form-group" style={{flex: 1}}>
                                    <label className="ehr-form-label">Total Unit Replenishment</label>
                                    <input required type="number" className="ehr-input" value={newMed.stock} onChange={e => setNewMed({...newMed, stock: e.target.value})} />
                                </div>
                                <div className="ehr-form-group" style={{flex: 1}}>
                                    <label className="ehr-form-label">Retail Price Per Unit ($)</label>
                                    <input required type="number" step="0.01" className="ehr-input" value={newMed.price} onChange={e => setNewMed({...newMed, price: e.target.value})} />
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                                <button type="button" className="ehr-btn ehr-btn-outline" style={{flex: 1, justifyContent: 'center'}} onClick={() => setShowAddModal(false)}>Cancel Batch</button>
                                <button type="submit" className="ehr-btn ehr-btn-primary" style={{flex: 2, justifyContent: 'center'}}>Commit Stock Data</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ChemistDashboard;
