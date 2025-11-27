import "../../styles/admin_dashboard.css";


export const SalesChart = ({ activeView, onViewChange }) => {
  // Y-axis values
  const yValues = [0, 50, 100, 150, 200];
  const minChartWidth = 600; // Minimum width for readable chart

  return (
    <div className="card col-span-2 flex-1" style={{ minHeight: 'fit-content', display: 'flex', flexDirection: 'column' }}>
      <div className="section-header" style={{ flexWrap: 'wrap', gap: '1rem', flexShrink: 0 }}>
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

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', padding: '0.75rem 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: '#fb923c' }}></div>
          <span style={{ color: '#6b7280' }}>Others</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', background: '#60a5fa' }}></div>
          <span style={{ color: '#6b7280' }}>Umrah</span>
        </div>
      </div>

      {/* Scrollable chart container */}
      <div style={{ 
        overflowX: 'auto', 
        overflowY: 'hidden',
        flexGrow: 1,
        minHeight: '280px',
        maxHeight: '350px'
      }}>
        <div style={{ minWidth: `${minChartWidth}px`, height: '100%', position: 'relative' }}>
          <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 700 250" preserveAspectRatio="none">
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
            {yValues.map((y, i) => {
              const yPos = 20 + (i * 45);
              return (
                <g key={y}>
                  <line x1="50" y1={yPos} x2="680" y2={yPos} stroke="#e5e7eb" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  <text x="35" y={yPos + 4} fill="#9ca3af" fontSize="12" textAnchor="end">{200 - y}</text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
              <text key={month} x={65 + i * 52} y="235" fill="#9ca3af" fontSize="12" textAnchor="middle">
                {month}
              </text>
            ))}

            {/* Chart lines */}
            <path d="M 60 110 Q 120 85, 180 105 T 300 75 T 420 95 T 540 65 T 660 85"
              fill="url(#orangeGradient)" stroke="#fb923c" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            <path d="M 60 135 Q 120 125, 180 130 T 300 115 T 420 120 T 540 110 T 660 115"
              fill="url(#blueGradient)" stroke="#60a5fa" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
    </div>
  );
};