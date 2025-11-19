import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Import routes (you'll create these later)
// import authRoutes from './api/routes/authRoutes.js';

const app = express();

// Global middlewares
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Mount API routes
// app.use('/api/auth', authRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;