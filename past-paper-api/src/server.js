import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Ticha AI Past Paper API running on http://localhost:${PORT}`);
  console.log(`📚 OpenAPI Documentation available at http://localhost:${PORT}/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

export default server;
