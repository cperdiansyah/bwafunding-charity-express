import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'

import { CORS_LOCAL, CORS_OPEN, NODE_ENV, PORT } from './utils/index.js'
import dbConnect from './config/database.js'
dotenv.config()

/* Routes */
import seederRoutes from './module/seeder/routes/index.js'
import authRoutes from './module/auth/routes/index.js'
import charityRoutes from './module/charity/routes/index.js'

const app: Express = express()
dbConnect()

if (process.env.NODE_ENV?.trim() === 'development') {
  app.use(morgan('dev'))
}
const port: number = PORT ? Number(PORT) : 3000

const whitelist: string[] = [CORS_LOCAL, ...CORS_OPEN?.split(', ')]

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  next()
})

app.use(
  cors({
    origin: function (origin: any, callback: CallableFunction) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      error: {
        code: 403,
        message: 'Not allowed by CORS',
      },
    })
  } else {
    next(err)
  }
})

app.use(cookieParser())
app.use(express.json())

/* Routes */

app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'Express + TypeScript Server is running',
  })
})

// Auth routes
app.use('/api/v1/auth', authRoutes)

/* Charity router */
app.use('/api/v1/charity', charityRoutes)

// Seeder route
if (NODE_ENV?.trim() === 'development') {
  app.use('/api/v1/seeder', seederRoutes)
}

app.listen(port, `0.0.0.0:${port}`, () => {
  let log
  if (NODE_ENV?.trim() === 'development') {
    log = `⚡️[server]: Server is running  ${process.env.NODE_ENV} mode on http://localhost:${port}`
  } else {
    log = `⚡️[server]: Server is running  ${process.env.NODE_ENV} mode on ${port}`
  }
  console.log(log)
})
