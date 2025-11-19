
import { ArrowUpRight} from 'lucide-react';

import "../../../styles/admin_dashboard/admin_dashboard.css";

// UsersGrowthMap Component
export const UsersGrowthMap = () => (
  <div className="card">
    <div className="section-header">
      <h3 className="section-title">Users growth</h3>
      <ArrowUpRight size={20} color="#9ca3af" />
    </div>
    <div style={{ position: 'relative', height: '16rem', background: '#f9fafb', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', opacity: 0.2 }}>
        <path d="M50,100 Q100,50 150,100 T250,100" stroke="#cbd5e1" strokeWidth="2" fill="none" />
        <path d="M30,120 L270,120 L250,180 L50,180 Z" fill="#cbd5e1" />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: '#10b981' }}></div>
          <span style={{ color: '#6b7280' }}>Algeria (55%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: '#3b82f6' }}></div>
          <span style={{ color: '#6b7280' }}>Annaba (50%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: '#ef4444' }}></div>
          <span style={{ color: '#6b7280' }}>Tlemcen (65%)</span>
        </div>
      </div>
    </div>
  </div>
);