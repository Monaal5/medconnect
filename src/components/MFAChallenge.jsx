import React, { useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';

const MFAChallenge = ({ factorId, onVerify, onCancel }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await onVerify(code);
        } catch (err) {
            setError('Invalid verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mfa-challenge card glass" style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', textAlign: 'center' }}>
            <div className="mfa-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <ShieldCheck size={32} color="#10b981" />
            </div>
            <h2>Two-Step Verification</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Enter the 6-digit code from your authenticator app.</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        letterSpacing: '0.5rem',
                        borderRadius: '12px',
                        border: '1px solid #334155',
                        background: '#0f172a',
                        color: 'white',
                        marginBottom: '1.5rem'
                    }}
                    required
                />
                {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={onCancel} className="secondary-btn" style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" className="primary-btn" style={{ flex: 1 }} disabled={loading || code.length < 6}>
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
            </form>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                <Info size={14} />
                <span>Need help? Contact your administrator.</span>
            </div>
        </div>
    );
};

export default MFAChallenge;
