import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Stethoscope, Pill, FlaskConical,
    Users, Truck, ShieldCheck, ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Login.css';

import logo from '../assets/logo.png';

const ROLES = [
    { id: 'doctor', title: 'Physician', icon: Stethoscope, color: 'green', desc: 'Secure portal for doctors & specialists' },
    { id: 'patient', title: 'Patient', icon: Users, color: 'blue', desc: 'Personal health dashboard' },
    { id: 'chemist', title: 'Pharmacist', icon: Pill, color: 'orange', desc: 'Inventory & digital billing terminal' },
    { id: 'lab', title: 'Diagnostics', icon: FlaskConical, color: 'purple', desc: 'Pathology & sample management' },
    { id: 'vendor', title: 'Logistics', icon: Truck, color: 'indigo', desc: 'Medical equipment & rentals' },
    { id: 'admin', title: 'System Admin', icon: ShieldCheck, color: 'red', desc: 'Platform core & infrastructure' }
];

const LoginPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            setError('System Access Denied: Please select an authorization role.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: selectedRole
                        }
                    }
                });

                if (signUpError) throw signUpError;

                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([{
                        id: data.user.id,
                        full_name: fullName,
                        role: selectedRole,
                        email: email
                    }]);

                if (profileError) console.error("Profile creation error:", profileError);

                setError('Registration successful! Please verify your identity or log in.');
                setIsSignUp(false);
            } else {
                const { data, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (authError) throw authError;

                navigate(`/${selectedRole}`);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-sidebar glass">
                <div className="sidebar-brand">
                    <img src={logo} alt="MedConnect Logo" className="brand-logo" />
                    <h1>MedConnect<span>+</span></h1>
                </div>
                <div className="sidebar-content">
                    <h2>The Future of Medical Operations.</h2>
                    <p>Orchestrating care through unified digital infrastructure and AI-driven intelligence.</p>
                    <div className="login-stats">
                        <div className="login-stat-item">
                            <h3>14k+</h3>
                            <p>Endpoints</p>
                        </div>
                        <div className="login-stat-item">
                            <h3>100%</h3>
                            <p>Encrypted</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="login-main">
                <div className="login-form-container">
                    <div className="form-header">
                        <h2>{isSignUp ? 'Initialize Access' : 'Secure Terminal Login'}</h2>
                        <p className="subtitle">{isSignUp ? 'Register within the MedConnect ecosystem' : 'Authorize your credentials to enter the hub'}</p>
                    </div>

                    <form onSubmit={handleAuth} className="login-form">
                        <div className="role-grid">
                            {ROLES.map((role) => (
                                <div
                                    key={role.id}
                                    className={`role-card ${selectedRole === role.id ? 'active' : ''} ${role.color}`}
                                    onClick={() => setSelectedRole(role.id)}
                                >
                                    <role.icon className="role-icon" size={28} strokeWidth={2.5} />
                                    <div className="role-info">
                                        <h3>{role.title}</h3>
                                        <p>{role.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="form-inputs">
                            {error && <div className="error-message" style={{
                                padding: '12px',
                                background: error.includes('successful') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: error.includes('successful') ? '#10b981' : '#ef4444',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                textAlign: 'center'
                            }}>{error}</div>}

                            {isSignUp && (
                                <div className="input-group">
                                    <label>Personnel Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter full legal name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="name@medconnect.hub"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Passcode</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-btn" disabled={!selectedRole || loading}>
                            <span>{loading ? 'Authenticating...' : (isSignUp ? 'Request Access' : 'Establish Connection')}</span>
                            <ArrowRight size={22} strokeWidth={3} />
                        </button>

                        <p className="forgot-pass">
                            {isSignUp ? 'Already registered? ' : "Awaiting credentials? "}
                            <span
                                onClick={() => setIsSignUp(!isSignUp)}
                                style={{ cursor: 'pointer' }}
                            >
                                {isSignUp ? 'Sign In' : 'Create Account'}
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
