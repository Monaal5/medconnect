import React, { useState } from 'react';
import { Pill, Plus, Search, Edit2, AlertCircle, Save, X, Package } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../data/mock';
import './Inventory.css';

const Inventory = () => {
    const { medicines, updateStock, addMedicine } = useGlobal();
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMed, setNewMed] = useState({ name: '', category: '', dose: '', price: '', stock: '' });

    const handleEdit = (med) => {
        setEditingId(med.id);
        setEditValue(med.stock);
    };

    const handleSave = (id) => {
        updateStock(id, 'stock', parseInt(editValue));
        setEditingId(null);
    };

    const handleAddMed = async (e) => {
        e.preventDefault();
        await addMedicine({ ...newMed, stock: parseInt(newMed.stock), price: parseFloat(newMed.price) });
        setShowAddModal(false);
        setNewMed({ name: '', category: '', dose: '', price: '', stock: '' });
    };

    return (
        <div className="dashboard-fade">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-main)' }}>
                <div>
                    <h1>Pharmacy Inventory</h1>
                    <p className="subtitle">Real-time pharmaceuticals tracking & replenishment.</p>
                </div>
                <button className="primary-btn" onClick={() => setShowAddModal(true)}>
                    <Plus size={20} />
                    <span>Register Stock</span>
                </button>
            </header>

            <div className="inventory-controls">
                <div className="search-bar">
                    <Search size={18} />
                    <input type="text" placeholder="Search by formula or brand..." />
                </div>
                <div className="filter-chips">
                    <span className="chip active">All</span>
                    <span className="chip">Antibiotics</span>
                    <span className="chip">Low Inventory</span>
                </div>
            </div>

            <div className="card glass inventory-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>MEDICINE</th>
                            <th>CATEGORY</th>
                            <th>PRICE / UNIT</th>
                            <th>STOCK LEVEL</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((med) => (
                            <tr key={med.id}>
                                <td>
                                    <div className="med-info">
                                        <div className="med-icon"><Pill size={20} /></div>
                                        <div>
                                            <p className="name">{med.name}</p>
                                            <p className="dose subtitle">{med.dose}</p>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="cat-tag">{med.category}</span></td>
                                <td>{formatCurrency(med.price)}</td>
                                <td>
                                    {editingId === med.id ? (
                                        <div className="edit-input">
                                            <input
                                                className="form-input"
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        <div className="stock-status">
                                            <span className={`stock-count ${med.stock < 20 ? 'low' : ''}`}>
                                                {med.stock} units
                                            </span>
                                            {med.stock < 20 && <AlertCircle size={16} className="alert-icon" />}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div className="action-row">
                                        {editingId === med.id ? (
                                            <>
                                                <button className="save-btn" onClick={() => handleSave(med.id)}><Save size={18} /></button>
                                                <button onClick={() => setEditingId(null)}><X size={18} /></button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleEdit(med)}><Package size={18} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Stock Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="glass" style={{ width: '500px', padding: '2.5rem', borderRadius: '24px' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>Register Hospital Stock</h2>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddMed} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <input className="form-input" placeholder="Brand Name" required value={newMed.name} onChange={e => setNewMed({ ...newMed, name: e.target.value })} />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input className="form-input" placeholder="Category" required value={newMed.category} onChange={e => setNewMed({ ...newMed, category: e.target.value })} />
                                <input className="form-input" placeholder="Dose (e.g. 500mg)" required value={newMed.dose} onChange={e => setNewMed({ ...newMed, dose: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input className="form-input" type="number" placeholder="Inital Stock" required value={newMed.stock} onChange={e => setNewMed({ ...newMed, stock: e.target.value })} />
                                <input className="form-input" type="number" step="0.01" placeholder="Price per unit" required value={newMed.price} onChange={e => setNewMed({ ...newMed, price: e.target.value })} />
                            </div>
                            <button type="submit" className="primary-btn full-width" style={{ justifyContent: 'center' }}>Commit to Inventory</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
