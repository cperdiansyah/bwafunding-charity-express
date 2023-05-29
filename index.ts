import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'

import { CORS_LOCAL, CORS_OPEN, NODE_ENV, PORT } from './utils'
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

const whitelist: string[] = [CORS_LOCAL, ...CORS_OPEN?.split(', ')]

app.use(
  cors({
    // origin: CORS_OPEN || CORS_LOCAL,
    // origin: whitelist,
    origin: function (origin: any, callback: CallableFunction) {
      console.log(origin)
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

app.listen(PORT, () => {
  console.log(
    `⚡️[server]: Server is running  ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  )
})
