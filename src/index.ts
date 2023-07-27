import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'

import {
  CORS_LOCAL,
  CORS_OPEN,
  NODE_ENV,
  PORT,
  __dirname,
} from './utils/index.js'
import dbConnect from './config/database.js'
dotenv.config()

/* Routes */
import seederRoutes from './module/seeder/routes/index.js'
import authRoutes from './module/auth/routes/index.js'
import charityRoutes from './module/charity/routes/index.js'
import charityFundHistoryRoutes from './module/charity/routes/fund_history.js'
import mediaRoutes from './module/media/routes/index.js'
import bannerRoutes from './module/banner/routes/index.js'
import transactionRoutes from './module/transaction/routes/index.js'
import approvalRoutes from './module/approval/routes/index.js'
import userRoutes from './module/user/routes/index.js'

const app: Express = express()
dbConnect()

const port: number = PORT ? Number(process.env.PORT) : 3000

const uploadFolder = path.resolve(__dirname, 'storage')
app.use('/storage', express.static(uploadFolder))

if (process.env.NODE_ENV?.trim() === 'development') {
  app.use(morgan('dev'))
}

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
// app.use(express.static(__dirname))

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
/* User Routes */
app.use('/api/v1/user', userRoutes)
/* Charity router */
app.use('/api/v1/charity', charityRoutes)
app.use('/api/v1/charity-fund-history', charityFundHistoryRoutes)

/* Banner router */
app.use('/api/v1/banner', bannerRoutes)

/* Media router */
app.use('/api/v1/media', mediaRoutes)

/* Payment Router */
app.use('/api/v1/transaction', transactionRoutes)

/* Approval routes */
app.use('/api/v1/approval', approvalRoutes)

// Seeder route
if (NODE_ENV?.trim() === 'development') {
  app.use('/api/v1/seeder', seederRoutes)
}

app.listen(port, '0.0.0.0', () => {
  let log = `⚡️[server]: Server is running  ${process.env.NODE_ENV} mode on `
  if (NODE_ENV?.trim() === 'development') {
    log += `http://localhost:${port}`
  } else {
    log = `${port}`
  }
  console.log(log)
})
