import dotenv from 'dotenv'

dotenv.config()

export const { MONGODB_URI: MONGODB_URI = '', PORT = 5000 } = process.env
