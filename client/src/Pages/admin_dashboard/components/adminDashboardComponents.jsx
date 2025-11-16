
import React, { useState } from 'react';
import { ArrowUpRight, TrendingDown, Plane, Users } from 'lucide-react';
import { StatusCard,DecoratedCard } from './status_cards';
import "../../../styles/admin_dashboard/admin_dashboard.css";



const SalesChart = ({ activeView, onViewChange }) => {
  // Y-axis values
  const yValues = [0, 50, 100, 150, 200]; // match your chart scale

  return (
    <div className="card col-span-2 " style={{ height: '100%',minHeight:'fit-content' }}>
      <div className="section-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h3 className="section-title">Sales graph</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['yearly', 'monthly', 'weekly'].map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`btn-filter ${activeView === view ? 'btn-filter-active' : 'btn-filter-inactive'}`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', height: 'calc(100% - 3rem)' }}>
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 700 200">
          <defs>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines with Y-axis labels */}
          {yValues.map((y) => (
            <g key={y}>
              <line x1="50" y1={y} x2="680" y2={y} stroke="#e5e7eb" strokeWidth="1" />
              <text x="30" y={y + 4} fill="#9ca3af" fontSize="11" textAnchor="end">{y}</text>
            </g>
          ))}

          {/* X-axis labels */}
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
            <text key={month} x={65 + i * 52} y="195" fill="#9ca3af" fontSize="11" textAnchor="middle">
              {month}
            </text>
          ))}

          {/* Chart lines */}
          <path d="M 60 150 Q 120 120, 180 140 T 300 110 T 420 130 T 540 100 T 660 120"
            fill="url(#orangeGradient)" stroke="#fb923c" strokeWidth="2" />
          <path d="M 60 170 Q 120 160, 180 165 T 300 150 T 420 155 T 540 145 T 660 150"
            fill="url(#blueGradient)" stroke="#60a5fa" strokeWidth="2" />
        </svg>

        {/* Legend */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: '#fb923c' }}></div>
            <span style={{ color: '#6b7280' }}>Others</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: '#60a5fa' }}></div>
            <span style={{ color: '#6b7280' }}>Umrah</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// DestinationItem Component
const DestinationItem = ({ flag, country, requests }) => (
  <div className="destination-item">
    <div className="destination-info">
      <div className="destination-flag">{flag}</div>
      <div>
        <div className="destination-name">Destination</div>
        <div className="destination-city">city</div>
      </div>
    </div>
    <div className="destination-count">{requests}</div>
  </div>
);

// DestinationsList Component
const DestinationsList = ({ destinations }) => (
  <div className="card">
    <div className="section-header">
      <h3 className="section-title">Most requested destinations</h3>
      <ArrowUpRight size={20} color="#9ca3af" />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {destinations.map((dest, index) => (
        <DestinationItem key={index} {...dest} />
      ))}
    </div>
  </div>
);

// UsersGrowthMap Component
const UsersGrowthMap = () => (
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

// BookingRow Component
const BookingRow = ({ id, user, destination, date, status, statusColor }) => (
  <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#117BB8', fontWeight: 500 }}>{id}</td>
    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>{user}</td>
    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#9ca3af' }}>{destination}</td>
    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#6b7280' }}>{date}</td>
    <td style={{ padding: '0.75rem 1rem' }}>
      <span className="status-badge" style={{ color: statusColor, backgroundColor: `rgba(${parseInt(statusColor.slice(1,3),16)}, ${parseInt(statusColor.slice(3,5),16)}, ${parseInt(statusColor.slice(5,7),16)}, 0.2)` }}>
        <div className="status-dot" style={{ background: statusColor }}></div>
        {status}
      </span>
    </td>
  </tr>
);

// RecentBookings Component
const RecentBookings = ({ bookings }) => (
  <div className="card col-span-2">
    <div className="section-header">
      <h3 className="section-title">Recent bookings</h3>
      <ArrowUpRight size={20} color="#9ca3af" />
    </div>
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <th>Order ID</th>
            <th>User name</th>
            <th>Destination</th>
            <th>Trip date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <BookingRow key={index} {...booking} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [chartView, setChartView] = useState('yearly');

  const destinations = [
    { flag: '🇻🇳', country: 'Vietnam', requests: 342 },
    { flag: '🇰🇷', country: 'South Korea', requests: 342 },
    { flag: '🇨🇳', country: 'China', requests: 342 },
    { flag: '🇧🇷', country: 'Brazil', requests: 342 },
    { flag: '🇨🇦', country: 'Canada', requests: 342 }
  ];

  const bookings = [
    { id: '#CR000123', user: 'had mohamed', destination: 'Destination', date: '10-10-2025', status: 'Delivered', statusColor: '#10b981' },
    { id: '#CR000123', user: 'had mohamed', destination: 'Destination', date: '10-10-2025', status: 'Pending', statusColor: '#9ca3af' },
    { id: '#CR000123', user: 'had mohamed', destination: 'Destination', date: '10-10-2025', status: 'Returned', statusColor: '#f59e0b' },
    { id: '#CR000123', user: 'had mohamed', destination: 'Destination', date: '10-10-2025', status: 'Confirmed', statusColor: '#06b6d4' }
  ];

  return (
    <>
     
      <div className='p-4' style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <div style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.875rem', color: '#1f2937' }} className='text-2xl'>Overview</h2>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Hello User ! check out what's happening</p>
          </div>

          {/* Stats Cards */}
          <div className="grid-1-md-3" style={{ marginBottom: '2rem' }}>
           
            <DecoratedCard title='Revenue' amount='12345.00 DZD' subTitle='From this month' />
            <StatusCard title='Bookings' amount='143' subTitle='From this month' />
            <StatusCard title='Views' amount='2124' profitColor='#00A844'  icon={Users} subTitle='From this month'/>
            
          </div>

          {/* Charts Section */}
          <div className="grid-1-lg-3  " style={{ marginBottom: '2rem' }}>
            <SalesChart activeView={chartView} onViewChange={setChartView} />
            <DestinationsList destinations={destinations} />
          </div>

          {/* Bottom Section */}
          <div className="grid-1-lg-3">
            <UsersGrowthMap />
            <RecentBookings bookings={bookings} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;