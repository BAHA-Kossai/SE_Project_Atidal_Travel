//------------test case only ---------------//

import http from 'http';
import  config  from './config/config.js'; // assuming you still want to read .env configs
import supabase from './config/supabase.js';
import BaseRepository from './repositories/baseRepository.js';
import UserRepository from './repositories/userRepository.js';
const PORT = config.PORT || 3000;
const userRepo = new UserRepository(supabase);
const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
  const path = req.url.replace(/\/$/, ''); // remove trailing slash

  try {
    // GET /users -> fetch all users
    if (path === '/users' && req.method === 'GET') {
      const users = await userRepo.getAllUsers();
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', data: users }));
      return;
    }

    // GET /users/:id -> fetch user by ID
    if (path.startsWith('/users/') && req.method === 'GET') {
      const id = parseInt(path.split('/')[2]);
      const user = await userRepo.getUserById(id);
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', data: user }));
      return;
    }

    // POST /users -> create new user
    if (path === '/users' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', async () => {
        try {
          const record = JSON.parse(body);
          const newUser = await userRepo.createUser(record);
          res.writeHead(201);
          res.end(JSON.stringify({ status: 'success', data: newUser }));
        } catch (error) {
          res.writeHead(500);
          res.end(JSON.stringify({ status: 'error', message: error.message, data: {} }));
        }
      });
      return;
    }

    // PUT /users/:id -> update user
    if (path.startsWith('/users/') && req.method === 'PUT') {
      let body = '';
      req.on('data', chunk => (body += chunk));
      req.on('end', async () => {
        try {
          const id = parseInt(path.split('/')[2]);
          const updates = JSON.parse(body);
          const updatedUser = await userRepo.updateUser(id, updates);
          res.writeHead(200);
          res.end(JSON.stringify({ status: 'success', data: updatedUser }));
        } catch (error) {
          res.writeHead(500);
          res.end(JSON.stringify({ status: 'error', message: error.message, data: {} }));
        }
      });
      return;
    }

    // DELETE /users/:id -> delete user
    if (path.startsWith('/users/') && req.method === 'DELETE') {
      const id = parseInt(path.split('/')[2]);
      const deletedUser = await userRepo.deleteUser(id);
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', data: deletedUser }));
      return;
    }

    // GET /users/email/:email -> find user by email
    if (path.startsWith('/users/email/') && req.method === 'GET') {
      const email = decodeURIComponent(path.split('/')[3]);
      const user = await userRepo.findByEmail(email);
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', data: user }));
      return;
    }

    // GET /users/branch/:branchId -> find users by branch
    if (path.startsWith('/users/branch/') && req.method === 'GET') {
      const branchId = parseInt(path.split('/')[3]);
      const users = await userRepo.findByBranch(branchId);
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'success', data: users }));
      return;
    }

    // Default 404
    res.writeHead(404);
    res.end(JSON.stringify({ status: 'error', message: 'Route not found', data: {} }));
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ status: 'error', message: error.message, data: {} }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.NODE_ENV}`);
});
