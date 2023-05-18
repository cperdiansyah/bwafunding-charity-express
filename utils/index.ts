import dotenv from 'dotenv'

dotenv.config()

export const {
  MONGODB_URI: MONGODB_URI = '',
  NODE_ENV,
  PORT = 5000,
  JWT_SECRET = 'secret-token',
  REFRESH_TOKEN_SECRET = 'refresh-token',
  JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN_MS,
} = process.env
