import "../../styles/admin_dashboard.css";
import { ArrowUpRight } from "lucide-react";
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
export const  RecentBookings = ({ bookings }) => (
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
