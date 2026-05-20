import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  BCRYPT_ROUNDS: number;
  CORS_ORIGIN: string;
}

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env: EnvConfig = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: parseInt(getEnv('PORT', '5000'), 10),
  MONGODB_URI: getEnv('MONGODB_URI', 'mongodb://localhost:27017/smartleads'),
  JWT_ACCESS_SECRET: getEnv('JWT_ACCESS_SECRET', 'super_secret_access_key_change_in_prod'),
  JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET', 'super_secret_refresh_key_change_in_prod'),
  JWT_ACCESS_EXPIRES_IN: getEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: getEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  BCRYPT_ROUNDS: parseInt(getEnv('BCRYPT_ROUNDS', '12'), 10),
  CORS_ORIGIN: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
};
