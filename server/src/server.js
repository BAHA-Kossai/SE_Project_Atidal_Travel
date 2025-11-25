import app from './app.js';
import config from './config/config.js';

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Destinations API: http://localhost:${PORT}/api/destinations`);
  console.log(`📖 Bookings API: http://localhost:${PORT}/api/bookings`);
  console.log('');
  console.log('🎯 Testing endpoints:');
  console.log('   GET  /api/destinations           - Get all destinations');
  console.log('   GET  /api/destinations/search?q=paris - Search destinations');
  console.log('   GET  /api/bookings/user/{userId} - Get user bookings');
  console.log('');
  console.log('💡 Note: Authentication routes disabled for testing');
});