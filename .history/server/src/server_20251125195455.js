import config from './config/config.js';
import app from './app.js';
import 'dotenv/config';


const PORT = config.PORT || 3000;

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`📍 Environment: ${config.NODE_ENV}`);
});

export default server;
