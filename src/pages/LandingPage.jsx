import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, ShieldCheck, Stethoscope,
  TestTube2, Syringe, Building2, Pill, Activity, CheckCircle2
} from 'lucide-react';
import './LandingPage.css';
import Logo from '../assets/image.png';
import HeroVideo from '../assets/Healthcare_Platform_Module_Descriptions.mp4';
import LocationSelector from '../components/LocationSelector';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page mb-theme">

      {/* MediBuddy Navigation */}
      <nav className="mb-nav">
        <div className="section-container nav-container">
          <div className="nav-left">
            <Link to="/" className="brand-logo">
              <img src={Logo} alt="MedConnect Logo" style={{ height: '96px', objectFit: 'contain', mixBlendMode: 'multiply', filter: 'brightness(1.1) contrast(1.2)' }} />
            </Link>

            <div className="desktop-only">
              <LocationSelector />
            </div>
          </div>

          <div className="nav-right">
            <div className="nav-links desktop-only">
              <Link to="/medicine">Medicines</Link>
              <Link to="/labtest">Lab Tests</Link>
              <Link to="/online-doctor-consultation">Consult Doctor</Link>
              <Link to="/login" className="mb-gold-link">
                <ShieldCheck size={18} fill="#efcf58" color="#000" />
                Medconnect Gold
              </Link>
            </div>
            <div className="login-dropdown-wrapper">
              <Link to="/login" className="btn-login">Login / Signup</Link>
              <div className="login-dropdown-content">
                <Link to="/login?role=doctor">Doctor & Specialist</Link>
                <Link to="/login?role=patient">Patient Portal</Link>
                <Link to="/login?role=chemist">Pharmacist Hub</Link>
                <Link to="/login?role=lab">Diagnostics & Labs</Link>
                <Link to="/login?role=vendor">Rental Equipment</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MediBuddy Hero Section */}
      <section className="mb-hero">
        <div className="section-container hero-grid">
          <div className="hero-text">
            <h1>Book Health Checks, Lab tests, Online Medicine & <span>Doctor Consultation</span></h1>
            <p>One unified health app for your entire family's needs.</p>

            <div className="mb-search-box">
              <MapPin className="search-icon" size={20} color="#777" />
              <input type="text" placeholder="Search for Medicine, Doctors, Lab Tests" />
              <button className="search-btn">
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="hero-image" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <video
              src={HeroVideo}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* MediBuddy Services Grid */}
      <section className="mb-services">
        <div className="section-container">
          <div className="services-grid-container">

            <Link to="/online-doctor-consultation" className="mb-service-card">
              <div className="service-icon-box">
                <Stethoscope size={36} color="#004ba3" />
              </div>
              <div>
                <h3>Consult Doctor</h3>
                <p>Chat & Video Consultations</p>
              </div>
            </Link>

            <Link to="/medicine" className="mb-service-card">
              <div className="service-icon-box">
                <Pill size={36} color="#004ba3" />
              </div>
              <div>
                <h3>Medicines</h3>
                <p>Flat 20% Off</p>
              </div>
            </Link>

            <Link to="/labtest" className="mb-service-card">
              <div className="service-icon-box">
                <TestTube2 size={36} color="#004ba3" />
              </div>
              <div>
                <h3>Lab Tests</h3>
                <p>Health Checks from Home</p>
              </div>
            </Link>

            <Link to="/login" className="mb-service-card">
              <div className="service-icon-box">
                <Syringe size={36} color="#004ba3" />
              </div>
              <div>
                <h3>Vaccination</h3>
                <p>Book home slots easily</p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* MedConnect Gold Section */}
      <section className="section-container">
        <div className="mb-gold-banner">
          <div className="gold-content">
            <div className="gold-badge">
              Medconnect Gold
            </div>
            <h2>Unlimited Free Consultations for your Family</h2>
            <ul>
              <li><CheckCircle2 color="#f8c12a" size={20} /> Free Video Consultations 24x7</li>
              <li><CheckCircle2 color="#f8c12a" size={20} /> Valid for up to 6 family members</li>
              <li><CheckCircle2 color="#f8c12a" size={20} /> From all Specialities</li>
            </ul>
            <Link to="/login" className="gold-btn">Buy Gold Now</Link>
          </div>
          <div className="gold-image-container desktop-only">
            <ShieldCheck size={180} color="#f8c12a" opacity={0.2} />
          </div>
        </div>
      </section>

      {/* Footer mimicking MediBuddy */}
      <footer className="mb-footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Medconnect</h4>
              <Link to="#">About Us</Link>
              <Link to="#">Careers</Link>
              <Link to="#">Press</Link>
              <Link to="#">Contact</Link>
            </div>
            <div className="footer-col">
              <h4>For Patients</h4>
              <Link to="/online-doctor-consultation">Consult a Doctor</Link>
              <Link to="/labtest">Book Lab Tests</Link>
              <Link to="/medicine">Order Medicines</Link>
              <Link to="#">Health Articles</Link>
            </div>
            <div className="footer-col">
              <h4>For Hospitals</h4>
              <Link to="/login">Partner with us</Link>
              <Link to="/login">Corporate Wellness</Link>
              <Link to="/login">Directory</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link to="#">Terms & Conditions</Link>
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Refund Policy</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="copyright">
              © 2026 Medconnect. All rights reserved.
            </div>
            <div className="brand-logo" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={Logo} alt="MedConnect" style={{ height: '64px' }} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
