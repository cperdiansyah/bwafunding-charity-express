import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { PORT } from './utils'
import dbConnect from './config/database'

dotenv.config()

const app: Express = express()
dbConnect()

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running ggggggggggggg')
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})
