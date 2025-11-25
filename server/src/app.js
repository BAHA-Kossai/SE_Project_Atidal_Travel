import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import ONLY the routes that work
import destinationsRoutes from './api/routes/destinationsRoutes.js';
import bookingsRoutes from './api/routes/bookingsRoutes.js';

const app = express();

// Global middlewares
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount ONLY working API routes
app.use('/api/destinations', destinationsRoutes);
app.use('/api/bookings', bookingsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;