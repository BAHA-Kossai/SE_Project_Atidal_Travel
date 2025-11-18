import app from './app.js';
import config from './config/config.js';

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Destinations API: http://localhost:${PORT}/api/destinations`);
  console.log(`📖 Create booking: POST http://localhost:${PORT}/api/bookings`);
  console.log(`👤 User bookings: GET http://localhost:${PORT}/api/bookings/user/{userId}`);
});