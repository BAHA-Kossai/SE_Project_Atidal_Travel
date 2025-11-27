import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { setupBookingRoutes } from './api/routes/bookingsRoutes.js';
import { setupGuidedTripsRoutes } from './api/routes/guidedTripsRoutes.js';
import { setupDestinationRoutes } from './api/routes/destinationsRoutes.js';
import { setupBranchRoutes } from './api/routes/branchesRoutes.js';
import { setupGuideRoutes } from './api/routes/guidesRoutes.js';
import { setupTripInfoRoutes } from './api/routes/tripInfoRoutes.js';

const app = express();

// Global middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uploadsDir = path.resolve(process.cwd(), 'server', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Mount API routes
setupBookingRoutes(app);
setupGuidedTripsRoutes(app);
setupDestinationRoutes(app);
setupBranchRoutes(app);
setupGuideRoutes(app);
setupTripInfoRoutes(app);

// Error handling middleware
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - must be last, catches all unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;