import React, { useState } from 'react';
import {
    ShoppingBag, Pill, TrendingUp, AlertCircle,
    Search, Plus, Filter, Download,
    ArrowUpRight, ArrowDownRight, Printer,
    FileText, History, X
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../data/mock';
import './ChemistDashboard.css';

const ChemistDashboard = () => {
    const { medicines, prescriptions, addMedicine } = useGlobal();
    const [showStockModal, setShowStockModal] = useState(false);
    const [newMed, setNewMed] = useState({ name: '', category: '', stock: '', price: '' });

    const lowStock = medicines.filter(m => m.stock < 20);

    // Derived stats
    const totalStockValue = medicines.reduce((acc, current) => acc + (current.price * (current.stock || 0)), 0);
    const recentSalesCount = prescriptions.length;

    const handleAddMed = async (e) => {
        e.preventDefault();
        await addMedicine(newMed);
        setShowStockModal(false);
        setNewMed({ name: '', category: '', stock: '', price: '' });
    };

    return (
        <div className="dashboard-fade">
            <header className="dashboard-header">
                <div>
                    <h1 className="clinic-title">Pharmacy Operations</h1>
                    <p className="subtitle">Inventory management, demand forecasting, and GST billing.</p>
                </div>
                <div className="header-actions">
                    <button className="secondary-btn glass" onClick={() => setShowStockModal(true)}>
                        <Plus size={18} />
                        <span>Add Stock</span>
                    </button>
                    <button className="primary-btn">
                        <History size={18} />
                        <span>Sales History</span>
                    </button>
                </div>
            </header>

            <section className="stats-strip">
                <div className="stat-card glass">
                    <div className="stat-icon"><ShoppingBag size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-title">Inventory Value</span>
                        <h3 className="stat-value">{formatCurrency(totalStockValue)}</h3>
                        <span className="stat-trend plus">Live Valuation</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon"><Pill size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-title">Medications</span>
                        <h3 className="stat-value">{medicines.length}</h3>
                        <span className="stat-trend minus">{lowStock.length} Low Stock</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon"><TrendingUp size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-title">Prescriptions</span>
                        <h3 className="stat-value">{recentSalesCount}</h3>
                        <span className="stat-trend plus">Pending fulfillment</span>
                    </div>
                </div>
            </section>

            <div className="chemist-grid">
                <section className="inventory-summary glass card">
                    <div className="card-header">
                        <h2>Inventory Insights</h2>
                    </div>

                    <div className="low-stock-list">
                        <h3>Low Stock Alerts</h3>
                        {lowStock.length > 0 ? (
                            lowStock.map(med => (
                                <div key={med.id} className="low-stock-item">
                                    <div className="med-info">
                                        <strong>{med.name}</strong>
                                        <span>{med.category}</span>
                                    </div>
                                    <div className="stock-info">
                                        <span className="count">{med.stock} units</span>
                                        <AlertCircle size={14} className="alert-icon" />
                                    </div>
                                    <button className="reorder-btn">Refill</button>
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">All stock levels are optimal.</p>
                        )}
                    </div>
                </section>

                <section className="billing-module glass card">
                    <div className="card-header">
                        <h2>GST Billing Quick-Console</h2>
                    </div>
                    <div className="billing-placeholder">
                        <div className="placeholder-content">
                            <Printer size={48} className="icon-muted" />
                            <h3>Ready to Generate Bill</h3>
                            <p>Select a prescription or add items manually to generate a GST compliant invoice.</p>
                            <div className="billing-actions">
                                <button className="primary-btn full-width">Create New Invoice</button>
                                <div className="or-divider">OR</div>
                                <button className="secondary-btn full-width"><FileText size={18} /> Digital Queue</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Stock Modal */}
            {showStockModal && (
                <div className="modal-overlay">
                    <div className="clinical-modal glass">
                        <div className="modal-header">
                            <div>
                                <h2>Inventory Management</h2>
                                <p className="modal-subtitle">Add new medicine to clinic database</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowStockModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleAddMed} className="clinical-form">
                            <div className="form-section">
                                <label>Medicine Details</label>
                                <input className="form-input" placeholder="Medicine Name" required value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
                                <input className="form-input" placeholder="Category (e.g. Antibiotic, Injection)" required value={newMed.category} onChange={e => setNewMed({ ...newMed, category: e.target.value })} />
                            </div>
                            <div className="form-section">
                                <label>Stock & Pricing</label>
                                <div className="form-row">
                                    <input className="form-input" placeholder="Quantity" type="number" required value={newMed.stock} onChange={e => setNewMed({ ...newMed, stock: e.target.value })} />
                                    <input className="form-input" placeholder="Price per Unit ($)" type="number" step="0.01" required value={newMed.price} onChange={e => setNewMed({ ...newMed, price: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="primary-btn full-width">Add to Inventory</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChemistDashboard;
