import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';
import { Bell, Search } from 'lucide-react';

const Layout = ({ children, role }) => {
    return (
        <div className="app-container">
            <Sidebar role={role} />
            <main className="main-content">
                <header className="main-header">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search patients, records, or medicines..." />
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn">
                            <Bell size={20} />
                            <span className="badge"></span>
                        </button>
                        <div className="divider"></div>
                        <div className="role-badge">{role.toUpperCase()}</div>
                    </div>
                </header>
                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
