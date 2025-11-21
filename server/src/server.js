import express from 'express';
import config from './config/config.js';
import authRouter from './api/routes/authRoutes.js';

const app = express();

// Parse JSON automatically
app.use(express.json());

// Register routes
app.use('/auth', authRouter);

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.NODE_ENV}`);
});
