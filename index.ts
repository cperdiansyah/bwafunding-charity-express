import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import { NODE_ENV, PORT } from './utils'
import dbConnect from './config/database'
dotenv.config()

/* Routes */
import seederRoutes from './module/seeder/routes'
import authRoutes from './module/auth/routes'
import charityRoutes from './module/charity/routes'

const app: Express = express()
dbConnect()

if (process.env.NODE_ENV?.trim() === 'development') {
  app.use(morgan('dev'))
}

app.use(cookieParser())
app.use(express.json())

/* Routes */
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running')
})

// Auth routes
app.use('/api/v1/auth', authRoutes)

/* Charity router */
app.use('/api/v1/charity', charityRoutes)


// Seeder route
if (NODE_ENV?.trim() === 'development') {
  app.use('/api/v1/seeder', seederRoutes)
}

app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Server is running  ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  )
})
