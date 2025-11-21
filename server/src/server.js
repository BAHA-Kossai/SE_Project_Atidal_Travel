//------------test case only ---------------//

import http from 'http';
import  config  from './config/config.js'; // assuming you still want to read .env configs
import supabase from './config/supabase.js';
import BaseRepository from './repositories/baseRepository.js';
import UserRepository from './repositories/userRepository.js';

import SignUpUseCase from './core/usecases/SignUpUseCase.js';

const PORT = config.PORT || 3000;
const userRepo = new UserRepository(supabase);
const server = http.createServer(async (req, res) => {
  

});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.NODE_ENV}`);
});
