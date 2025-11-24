
import { ArrowUpRight} from 'lucide-react';

import "../../../styles/admin_dashboard/admin_dashboard.css";


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
export const DestinationsList = ({ destinations }) => (
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