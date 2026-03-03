import React, { useState } from 'react';
import {
    ShoppingBag, Search, MapPin, Filter,
    Truck, Shield, Clock, CheckCircle2, Users, Plus, X
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatCurrency } from '../data/mock';
import './Rentals.css';

const Rentals = () => {
    const { rentals, bookRental, addRental } = useGlobal();
    const [searchTerm, setSearchTerm] = useState('');
    const [bookedId, setBookedId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', category: 'Mobility', price: '', security: '', status: 'Available' });

    const filteredItems = rentals.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBook = (id) => {
        bookRental(id);
        setBookedId(id);
        setTimeout(() => setBookedId(null), 3000);
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        await addRental({ ...newItem, price: parseFloat(newItem.price), security: parseFloat(newItem.security) });
        setShowAddModal(false);
        setNewItem({ name: '', category: 'Mobility', price: '', security: '', status: 'Available' });
    };

    return (
        <div className="dashboard-fade">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-main)' }}>
                <div>
                    <h1>Medical Equipment Hub</h1>
                    <p className="subtitle">Sanitized clinical gear & mobility solutions for home recovery.</p>
                </div>
                <button className="primary-btn" onClick={() => setShowAddModal(true)}>
                    <Plus size={20} />
                    <span>List Equipment</span>
                </button>
            </header>

            <div className="rental-search-box glass">
                <div className="search-inputs">
                    <div className="search-field">
                        <Search size={20} color="var(--primary)" />
                        <input
                            type="text"
                            placeholder="What equipment do you need?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="search-divider"></div>
                    <div className="search-field">
                        <MapPin size={20} color="var(--primary)" />
                        <input type="text" placeholder="Scanning nearby warehouses..." />
                    </div>
                    <button className="primary-btn">Optimize Search</button>
                </div>
            </div>

            <div className="rental-grid">
                {filteredItems.map((item) => (
                    <div key={item.id} className="rental-card glass" style={{ position: 'relative' }}>
                        <div className={`status-badge-float ${item.status.toLowerCase()}`}>
                            {item.status}
                        </div>
                        <div className="rental-icon">
                            {item.name.toLowerCase().includes('wheel') ? <Users size={28} /> : <ShoppingBag size={28} />}
                        </div>
                        <div className="rental-content">
                            <h3>{item.name}</h3>
                            <p className="category subtitle uppercase">{item.category}</p>

                            <div className="rental-pricing">
                                <div className="price-item">
                                    <span>Rent / Day</span>
                                    <strong>{formatCurrency(item.price)}</strong>
                                </div>
                                <div className="price-divider"></div>
                                <div className="price-item">
                                    <span>Security Deposit</span>
                                    <strong>{formatCurrency(item.security)}</strong>
                                </div>
                            </div>

                            <div className="rental-features">
                                <div className="feature"><Shield size={16} color="var(--primary)" /> Sanitized</div>
                                <div className="feature"><Truck size={16} color="var(--secondary)" /> Express Delivery</div>
                            </div>

                            <button
                                className={`primary-btn full-width ${item.status !== 'Available' ? 'disabled' : ''} ${bookedId === item.id ? 'success-btn' : ''}`}
                                onClick={() => handleBook(item.id)}
                                disabled={item.status !== 'Available' || bookedId === item.id}
                                style={{ justifyContent: 'center' }}
                            >
                                {bookedId === item.id ? (
                                    <><CheckCircle2 size={18} /> Reserved</>
                                ) : (
                                    item.status === 'Available' ? 'Rent Equipment' : 'Out of Stock'
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Rental Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="glass" style={{ width: '500px', padding: '2.5rem', borderRadius: '24px' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>Register New Inventory</h2>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <input className="form-input" placeholder="Equipment Name" required value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                            <select className="form-input" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                                <option value="Mobility">Mobility</option>
                                <option value="Respiratory">Respiratory</option>
                                <option value="Furniture">Hospital Furniture</option>
                                <option value="Monitoring">Monitoring Gear</option>
                            </select>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input className="form-input" type="number" placeholder="Rent Price" required value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
                                <input className="form-input" type="number" placeholder="Security Deposit" required value={newItem.security} onChange={e => setNewItem({ ...newItem, security: e.target.value })} />
                            </div>
                            <button type="submit" className="primary-btn full-width" style={{ justifyContent: 'center' }}>Approve for Listing</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rentals;
