import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sujju_foods',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_sujju_foods_32chars_min',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_token_secret_sujju_foods',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
