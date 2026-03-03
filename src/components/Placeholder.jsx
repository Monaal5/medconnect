import React from 'react';
import { Construction } from 'lucide-react';

const Placeholder = ({ title, role }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '1rem',
            color: 'var(--text-secondary, #6b7280)',
            textAlign: 'center',
            padding: '2rem',
        }}>
            <Construction size={48} strokeWidth={1.5} style={{ color: 'var(--accent, #6366f1)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary, #111827)', margin: 0 }}>
                {title}
            </h2>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
                This section is under construction and will be available soon.
            </p>
        </div>
    );
};

export default Placeholder;
