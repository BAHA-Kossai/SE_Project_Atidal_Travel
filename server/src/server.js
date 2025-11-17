import http from 'http';
import  config  from './config/config.js'; // assuming you still want to read .env configs

const PORT = config.PORT || 3000;

const server = http.createServer((req, res) => {
  // Simple routing
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from pure Node.js server!');
  } else {
    // Catch-all route
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.NODE_ENV}`);
});
