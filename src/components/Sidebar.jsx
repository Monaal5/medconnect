import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BarChart3, Users, FlaskConical, Pill, Stethoscope,
    Settings, ShoppingBag, Truck, LayoutDashboard,
    ClipboardList, Bell, User, Shield, HeartPulse, LogOut
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import './Sidebar.css';

const MENU_ITEMS = {
    doctor: [
        { name: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
        { name: 'Analytics', path: '/doctor/analytics', icon: BarChart3 },
        { name: 'Patients List', path: '/doctor/patients', icon: Users },
        { name: 'Clinic Stock', path: '/doctor/inventory', icon: Pill },
        { name: 'Doctor Info', path: '/doctor/profile', icon: User },
        { name: 'Lab Reports', path: '/doctor/labs', icon: FlaskConical },
    ],
    patient: [
        { name: 'My Health', path: '/patient', icon: HeartPulse },
        { name: 'Prescriptions', path: '/patient/prescriptions', icon: ClipboardList },
        { name: 'Lab Tests', path: '/patient/labs', icon: FlaskConical },
        { name: 'Equipment Rental', path: '/patient/rentals', icon: Truck },
    ],
    chemist: [
        { name: 'Dashboard', path: '/chemist', icon: LayoutDashboard },
        { name: 'Inventory', path: '/chemist/inventory', icon: Pill },
        { name: 'GST Billing', path: '/chemist/bills', icon: ShoppingBag },
    ],
    lab: [
        { name: 'Lab Dashboard', path: '/lab', icon: LayoutDashboard },
        { name: 'Test Queue', path: '/lab/tests', icon: FlaskConical },
        { name: 'Upload Reports', path: '/lab/uploads', icon: ClipboardList },
    ],
    vendor: [
        { name: 'Stock Manager', path: '/vendor', icon: LayoutDashboard },
        { name: 'My Listings', path: '/vendor/stock', icon: Truck },
        { name: 'Rental Orders', path: '/vendor/rentals', icon: ShoppingBag },
    ],
    admin: [
        { name: 'System Admin', path: '/admin', icon: Shield },
        { name: 'User Control', path: '/admin/users', icon: Users },
        { name: 'Audit Logs', path: '/admin/logs', icon: Settings },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    ]
};


const Sidebar = ({ role }) => {
    const { profile, logout } = useGlobal();
    const items = MENU_ITEMS[role] || [];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-box">M</div>
                <h2>MedConnect<span>+</span></h2>
            </div>

            <nav className="sidebar-nav">
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        end
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">
                        <User size={18} />
                    </div>
                    <div className="user-info">
                        <p className="user-name">{profile?.full_name || 'Clinical User'}</p>
                        <p className="user-role">{profile?.role || role.toUpperCase()}</p>
                    </div>
                </div>
                <button className="logout-btn" onClick={logout} title="Sign Out">
                    <LogOut size={20} />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
