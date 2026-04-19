import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, FileText, Pill, Leaf, Dumbbell, Baby, Activity } from 'lucide-react';
import './Pharmacy.css';
import Logo from '../assets/logo.png';
import LocationSelector from '../components/LocationSelector';

const Pharmacy = () => {
  return (
    <div className="pharmacy-page mb-theme">
      
      {/* Navbar Minimal Wrapper */}
      <nav className="mb-nav">
        <div className="section-container nav-container">
          <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" className="brand-logo">
              <img src={Logo} alt="MedConnect Logo" style={{ height: '96px', objectFit: 'contain', mixBlendMode: 'multiply', filter: 'brightness(1.1) contrast(1.2)' }} />
            </Link>
            <LocationSelector />
          </div>
          <div className="nav-right">
            <Link to="/online-doctor-consultation" style={{color: '#555', textDecoration: 'none', fontWeight: 'bold', marginRight: '1rem'}}>Consult Doctor</Link>
            <Link to="/login" className="btn-login">Login / Signup</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pharmacy-hero">
        <div className="section-container pharmacy-banner-content">
          <div className="pharmacy-text">
            <h1>Order Medicines Online</h1>
            <p>Flat 20% Off on all Prescription Medicines</p>
            
            <div className="upload-rx-box">
              <FileText size={40} color="#0066dc" />
              <div>
                <h3 style={{margin: '0 0 0.5rem 0'}}>Have a Prescription?</h3>
                <p style={{margin: 0, color: '#777', fontSize: '0.9rem'}}>Upload it and we'll do the rest.</p>
              </div>
              <button>Upload</button>
            </div>
          </div>
          
          <div className="pharmacy-promo-graphic" style={{display: 'flex', gap: '1rem'}}>
             <div style={{background: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '12px', textAlign: 'center'}}>
                <Pill size={64} color="#efcf58" />
                <h2 style={{marginTop: '1rem'}}>1 Lakh+</h2>
                <p>Products</p>
             </div>
          </div>
        </div>
      </section>

      {/* Search Bar positioned overlapping */}
      <div className="section-container">
        <div className="med-search">
          <Search size={22} color="#777" style={{margin: '0 1rem', alignSelf: 'center'}} />
          <input type="text" placeholder="Search for medicines, health products..." />
          <button>Search</button>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="med-categories">
        <div className="section-container">
          <div className="category-header">
            <h2>Shop by Category</h2>
          </div>
          
          <div className="med-grid">
            
            <Link to="/login" className="med-card">
              <div className="med-image-placeholder">
                <Leaf size={48} color="#10b981" />
              </div>
              <h4>Ayurveda & Herbal</h4>
              <span className="discount">Up to 30% Off</span>
            </Link>

            <Link to="/login" className="med-card">
              <div className="med-image-placeholder">
                <Dumbbell size={48} color="#3b82f6" />
              </div>
              <h4>Fitness & Supplements</h4>
              <span className="discount">Up to 40% Off</span>
            </Link>

            <Link to="/login" className="med-card">
              <div className="med-image-placeholder">
                <Baby size={48} color="#ec4899" />
              </div>
              <h4>Mom & Baby</h4>
              <span className="discount">Up to 25% Off</span>
            </Link>

            <Link to="/login" className="med-card">
              <div className="med-image-placeholder">
                <Activity size={48} color="#ef4444" />
              </div>
              <h4>Personal Care</h4>
              <span className="discount">Flat 15% Off</span>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Pharmacy;
