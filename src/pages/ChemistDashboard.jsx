import React, { useState } from 'react';
import {
    ShoppingBag, Pill, TrendingUp, AlertCircle,
    Search, Plus, Filter, Download,
    ArrowUpRight, ArrowDownRight, Printer,
    FileText, History
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../data/mock';
import './ChemistDashboard.css';

const ChemistDashboard = () => {
    const { medicines, prescriptions } = useGlobal();
    const lowStock = medicines.filter(m => m.stock < 20);

    // Derived stats
    const totalStockValue = medicines.reduce((acc, current) => acc + (current.price * current.stock), 0);
    const recentSalesCount = prescriptions.length; // Using prescriptions as proxy for sales events

    return (
        <div className="dashboard-fade">
            <header className="dashboard-header">
                <div>
                    <h1>Pharmacy Operations</h1>
                    <p className="subtitle">Inventory management, demand forecasting, and GST billing.</p>
                </div>
                <div className="header-actions">
                    <button className="secondary-btn">
                        <History size={18} />
                        <span>Bill History</span>
                    </button>
                    <button className="primary-btn">
                        <Plus size={18} />
                        <span>Generate Bill</span>
                    </button>
                </div>
            </header>

            <section className="stats-strip">
                <div className="stat-card glass">
                    <div className="stat-icon blue"><ShoppingBag size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-title">Inventory Value</span>
                        <h3 className="stat-value">{formatCurrency(totalStockValue)}</h3>
                        <span className="stat-trend plus"><ArrowUpRight size={12} /> Live Valuation</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon green"><Pill size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-title">Medications</span>
                        <h3 className="stat-value">{medicines.length}</h3>
                        <span className="stat-trend plus">{lowStock.length} Low Stock</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <div className="stat-icon orange"><TrendingUp size={20} /></div>
                    <div className="stat-content">
                        <span className="stat-title">Prescriptions</span>
                        <h3 className="stat-value">{recentSalesCount}</h3>
                        <span className="stat-trend plus">Pending fulfillment</span>
                    </div>
                </div>
            </section>

            <div className="chemist-grid">
                <section className="inventory-summary card glass">
                    <div className="card-header">
                        <h2>Inventory Insights</h2>
                        <button className="text-btn">Manage Inventory</button>
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
                                        <span className="count">{med.stock} units left</span>
                                        <AlertCircle size={14} className="alert-icon" />
                                    </div>
                                    <button className="reorder-btn">Reorder</button>
                                </div>
                            ))
                        ) : (
                            <p className="empty-msg">All stock levels are optimal.</p>
                        )}
                    </div>
                </section>

                <section className="billing-module card glass">
                    <div className="card-header">
                        <h2>GST Billing Quick-Console</h2>
                    </div>
                    <div className="billing-placeholder">
                        <div className="placeholder-content">
                            <Printer size={48} className="icon-muted" />
                            <h3>Ready to Generate Bill</h3>
                            <p>Select a prescription or add items manually to generate a GST compliant invoice.</p>
                            <div className="billing-actions">
                                <button className="primary-btn">Create New Invoice</button>
                                <div className="or-divider">OR</div>
                                <button className="secondary-btn"><FileText size={18} /> Prescriptions Queue</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ChemistDashboard;
