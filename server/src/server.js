//------------test case only ---------------//

import http from 'http';
import  config  from './config/config.js'; 
import { authRouter } from './api/routes/authRoutes.js';

const PORT = config.PORT || 3000;

const server = http.createServer(async (req, res) => {
   // Forward every request to the authRouter
    authRouter(req, res);

});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.NODE_ENV}`);
});
