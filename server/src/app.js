import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import destinationsRoutes from './api/routes/destinationsRoutes.js';
import bookingsRoutes from './api/routes/bookingsRoutes.js';
import guidedTripsRoutes from './api/routes/guidedTripsRoutes.js';
import branchesRoutes from './api/routes/branchesRoutes.js';

const app = express();

app.use((req, res, next) => {
  console.log('🔵 [App] Incoming request:', {
    method: req.method,
    url: req.url,
    contentType: req.headers['content-type'],
    contentLength: req.headers['content-length'],
    body: req.body // This should be empty before body parser
  });
  next();
});

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.method === 'POST' && req.url.includes('/bookings/create')) {
    console.log('🔵 [App] After body parser - Request body:', req.body);
    console.log('🔵 [App] After body parser - Body keys:', Object.keys(req.body));
  }
  next();
});

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));


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