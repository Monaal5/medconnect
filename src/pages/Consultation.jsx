import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Stethoscope, Video, MessageCircle, HeartPulse, Brain, Zap, Baby } from 'lucide-react';
import './Consultation.css';
import Logo from '../assets/logo.png';
import LocationSelector from '../components/LocationSelector';

const Consultation = () => {
  return (
    <div className="consultation-page">
      
      {/* Navbar Minimal Wrapper (Reuses generic styles) */}
      <nav className="mb-nav">
        <div className="section-container nav-container">
          <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" className="brand-logo">
              <img src={Logo} alt="MedConnect Logo" style={{ height: '96px', objectFit: 'contain', mixBlendMode: 'multiply', filter: 'brightness(1.1) contrast(1.2)' }} />
            </Link>
            <LocationSelector />
          </div>
          <div className="nav-right">
            <Link to="/login" className="btn-login">Login / Signup</Link>
          </div>
        </div>
      </nav>

      <section className="consult-hero">
        <div className="section-container">
          <h1>Consult Top Doctors Online</h1>
          <p>Private online consultations with verified doctors in all specialists</p>
          
          <div className="consult-search">
            <input type="text" placeholder="Search for doctors, specialties, symptoms..." />
            <button>Search</button>
          </div>
        </div>
      </section>

      <section className="specialties-section section-container">
        <h2>25+ Specialties Available</h2>
        <div className="specialties-grid">
          
          <Link to="/login" className="specialty-card">
            <div className="specialty-icon">
              <Stethoscope size={48} color="#0066dc" />
            </div>
            <h4>General Physician</h4>
            <p>₹399</p>
          </Link>

          <Link to="/login" className="specialty-card">
            <div className="specialty-icon">
              <HeartPulse size={48} color="#ef4444" />
            </div>
            <h4>Cardiology</h4>
            <p>₹599</p>
          </Link>

          <Link to="/login" className="specialty-card">
            <div className="specialty-icon">
              <Brain size={48} color="#8b5cf6" />
            </div>
            <h4>Psychiatry</h4>
            <p>₹499</p>
          </Link>

          <Link to="/login" className="specialty-card">
            <div className="specialty-icon">
              <Zap size={48} color="#f59e0b" />
            </div>
            <h4>Dermatology</h4>
            <p>₹449</p>
          </Link>

          <Link to="/login" className="specialty-card">
            <div className="specialty-icon">
              <Baby size={48} color="#ec4899" />
            </div>
            <h4>Pediatrics</h4>
            <p>₹399</p>
          </Link>

        </div>
      </section>

      <section className="how-it-works">
        <div className="section-container">
          <h2>How it Works</h2>
          <div className="steps-grid">
            
            <div className="step-card">
              <div className="step-number">1</div>
              <MessageCircle size={40} color="#0066dc" style={{marginBottom: '1rem'}} />
              <h3>Choose Specialty</h3>
              <p>Select the specialty or symptom you're experiencing from our comprehensive list.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <Video size={40} color="#0066dc" style={{marginBottom: '1rem'}} />
              <h3>Video Consult</h3>
              <p>Connect with a verified doctor within minutes via secure video call or chat.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <Stethoscope size={40} color="#0066dc" style={{marginBottom: '1rem'}} />
              <h3>Get Prescription</h3>
              <p>Receive a valid digital prescription and order medicines immediately.</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Consultation;
