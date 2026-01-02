import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';

import destinationsRoutes from './api/routes/destinationsRoutes.js';
import bookingsRoutes from './api/routes/bookingsRoutes.js';
import guidedTripsRoutes from './api/routes/guidedTripsRoutes.js';
import branchesRoutes from './api/routes/branchesRoutes.js';
import authRoutes from './api/routes/authRoutes.js';
import guideRouter from './api/routes/guideRoutes.js';
import userRouter from './api/routes/userRoutes.js';
import adminRouter from './api/routes/adminRoutes.js';
import payersRouter from './api/routes/PayersRoutes.js';
import travelersRouter from './api/routes/TravelersRoutes.js';
import ratingsRouter from './api/routes/ratingRoutes.js';




const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// // Add request logging middleware
// app.use((req, res, next) => {
//   console.log('🌐 [App] Incoming request:', req.method, req.originalUrl);
//   console.log('🌐 [App] Headers:', req.headers);
//   next();
// });

app.use('/api/auth', authRoutes);
app.use("/api/guide", guideRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter); 
app.use('/api/destinations', destinationsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/guided-trips', guidedTripsRoutes);
app.use('/api/branches', branchesRoutes);
app.use('/api/payers', payersRouter);
app.use('/api/travelers', travelersRouter);
app.use('/api/ratings', ratingsRouter);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  });
});

// Multer error handling middleware - comes BEFORE 404
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Too many files uploaded'
      });
    }
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
  
  next(err);
});

// Generic error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!'
  });
});

// 404 handler - MUST come LAST as catch-all
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found'
  });
});

export default app;