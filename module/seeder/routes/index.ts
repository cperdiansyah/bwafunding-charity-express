import dotenv from 'dotenv'
import express from 'express'
import { destroyData, importData } from '../controller'

// dotenv.config()

const router = express.Router()

router.get('/import', importData)
router.get('/destroy', destroyData)

export default router
