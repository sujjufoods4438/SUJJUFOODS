import { app } from './app.js';
import { config } from './config/env.js';
import { connectDB } from './database/connect.js';

async function bootstrap() {
  await connectDB();

  const server = app.listen(config.port, '0.0.0.0', () => {
    console.log(`[SUJJU FOODS API] Running on http://0.0.0.0:${config.port}`);
    console.log(`[SUJJU FOODS API] Environment: ${config.env}`);
    console.log(`[SUJJU FOODS API] Version: 1.0.0-phase1`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received. Closing HTTP server...');
    server.close(() => {
      console.log('HTTP server closed.');
    });
  });
}

bootstrap();
