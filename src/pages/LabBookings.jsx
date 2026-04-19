import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, Home, Activity, CheckCircle2, TestTube2 } from 'lucide-react';
import './LabBookings.css';
import Logo from '../assets/logo.png';
import LocationSelector from '../components/LocationSelector';

const LabBookings = () => {
  return (
    <div className="lab-page mb-theme">
      
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
            <Link to="/medicine" style={{color: '#555', textDecoration: 'none', fontWeight: 'bold', marginRight: '1rem'}}>Order Medicine</Link>
            <Link to="/login" className="btn-login">Login / Signup</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="lab-hero">
        <div className="section-container lab-banner-content">
          <div className="lab-text">
            <h1>Book Lab Tests & Health Packages</h1>
            <p>Get accurate reports from NABL certified labs.</p>
            
            <div className="lab-perks">
              <div><Home color="#0066dc" size={20} /> Free Home Sample Pickup</div>
              <div><Activity color="#0066dc" size={20} /> E-Reports in 24 hours</div>
            </div>

            <div className="lab-search">
              <Search size={22} color="#777" style={{margin: '0 1rem', alignSelf: 'center'}} />
              <input type="text" placeholder="Search for tests e.g. Complete Blood Count, Lipid Profile..." />
              <button>Search</button>
            </div>
          </div>

          <div className="lab-promo-img desktop-only" style={{background: '#f8f9fa', padding: '3rem', borderRadius: '50%', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
             <TestTube2 size={120} color="#0066dc" opacity={0.8} />
          </div>
        </div>
      </section>

      {/* Popular Packages */}
      <section className="lab-packages">
        <div className="section-container">
          <h2>Popular Health Packages</h2>
          
          <div className="packages-grid">
            
            <div className="package-card">
              <div className="pack-tag">BESTSELLER</div>
              <h3>Comprehensive Full Body Checkup</h3>
              <p className="tests-count">Includes 75 Tests</p>
              <ul style={{listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: '#555'}}>
                <li style={{marginBottom: '0.5rem'}}><CheckCircle2 size={16} color="#10b981" /> Thyroid Profile </li>
                <li style={{marginBottom: '0.5rem'}}><CheckCircle2 size={16} color="#10b981" /> Liver Function Test</li>
                <li style={{marginBottom: '0.5rem'}}><CheckCircle2 size={16} color="#10b981" /> CBC</li>
              </ul>
              <div className="price-row">
                <span className="new-price">₹1,499</span>
                <span className="old-price">₹3,000</span>
              </div>
              <Link to="/login" className="btn-book">Book Now</Link>
            </div>

            <div className="package-card">
              <div className="pack-tag" style={{background: '#e0f2fe'}}>RECOMMENDED</div>
              <h3>Advanced Diabetes Package</h3>
              <p className="tests-count">Includes 45 Tests</p>
              <ul style={{listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: '#555'}}>
                <li style={{marginBottom: '0.5rem'}}><CheckCircle2 size={16} color="#10b981" /> HbA1c</li>
                <li style={{marginBottom: '0.5rem'}}><CheckCircle2 size={16} color="#10b981" /> Fasting Blood Sugar</li>
                <li style={{marginBottom: '0.5rem'}}><CheckCircle2 size={16} color="#10b981" /> Lipid Profile</li>
              </ul>
              <div className="price-row">
                <span className="new-price">₹999</span>
                <span className="old-price">₹2,000</span>
              </div>
              <Link to="/login" className="btn-book">Book Now</Link>
            </div>

            <div className="package-card">
              <div className="pack-tag" style={{background: '#f3e8ff'}}>WOMEN</div>
              <h3>Women's Health Checkup</h3>
              <p className="tests-count">Includes 60 Tests</p>
              <ul style={{listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: '#555'}}>
                <li style={{marginBottom: '0.5rem'}}><CheckCircle2 size={16} color="#10b981" /> Iron Deficiency Profile</li>
                <li style={{marginBottom: '0.5rem'}}><CheckCircle2 size={16} color="#10b981" /> Vitamin D & B12</li>
                <li style={{marginBottom: '0.5rem'}}><CheckCircle2 size={16} color="#10b981" /> Complete Urine Analysis</li>
              </ul>
              <div className="price-row">
                <span className="new-price">₹1,899</span>
                <span className="old-price">₹4,000</span>
              </div>
              <Link to="/login" className="btn-book">Book Now</Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LabBookings;
