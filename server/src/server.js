import express from 'express';
import config from './config/config.js';
import authRouter from './api/routes/authRoutes.js';
import adminRouter from './api/routes/adminRoutes.js'; 
import userRouter from './api/routes/userRoutes.js';

import cors from 'cors'; 
const app = express();

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Parse JSON automatically
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);          // Auth routes: signup/signin
app.use('/api/admin', adminRouter);    // Admin management routes: create admin
app.use('/api/user',userRouter ); 

// Simple health check
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Server is running' });
});

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.NODE_ENV}`);
});
