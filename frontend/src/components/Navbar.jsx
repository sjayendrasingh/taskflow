import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Layout, User } from 'lucide-react';

const Navbar = ({ onBackToDashboard }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="glass-panel" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      borderRadius: '0 0 16px 16px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      marginBottom: '30px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={onBackToDashboard}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          padding: '8px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
        }}>
          <Layout size={20} color="#fff" />
        </div>
        <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          Kanban<span style={{ color: 'var(--accent-primary)' }}>Flow</span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <User size={16} color="var(--text-secondary)" />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.name}</span>
        </div>
        <button 
          onClick={logout} 
          className="btn btn-secondary" 
          style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '8px' }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
