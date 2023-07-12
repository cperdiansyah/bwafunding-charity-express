import express from 'express'
import { processTransaction } from '../controller/index.js'
const router = express.Router()

router.route('/process-transaction').post(processTransaction)


export default router
