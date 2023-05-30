import express from 'express'
import { destroyData, importData } from '../controller/index.js'

const router = express.Router()

router.get('/import', importData)
router.get('/destroy', destroyData)

export default router
