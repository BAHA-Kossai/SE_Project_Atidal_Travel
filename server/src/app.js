import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import destinationsRoutes from './api/routes/destinationsRoutes.js';
import bookingsRoutes from './api/routes/bookingsRoutes.js';
import guidedTripsRoutes from './api/routes/guidedTripsRoutes.js';
import branchesRoutes from './api/routes/branchesRoutes.js';
import authRoutes from './api/routes/authRoutes.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log('🌐 [App] Incoming request:', req.method, req.originalUrl);
  console.log('🌐 [App] Headers:', req.headers);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/guided-trips', guidedTripsRoutes);
app.use('/api/branches', branchesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!'
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found'
  });
});

export default app;