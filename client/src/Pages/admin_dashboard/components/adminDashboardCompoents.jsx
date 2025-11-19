
import  { useState } from 'react';
import {  Users } from 'lucide-react';
import { StatusCard,DecoratedCard } from './status_cards';
import "../../../styles/admin_dashboard/admin_dashboard.css";
import {RecentBookings} from './bookingList.jsx';
import {DestinationsList} from './destinationList.jsx';
import { SalesChart } from './salesChart.jsx';
import { UsersGrowthMap } from './userGrowthMap.jsx';






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
          <div className="flex flex-col xl:flex-row gap-6 mb-8" style={{ marginBottom: '2rem' }}>
            <SalesChart  activeView={chartView} onViewChange={setChartView} />
            <DestinationsList  destinations={destinations} />
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