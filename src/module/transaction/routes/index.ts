import express from 'express'
import { chargeTransaction } from '../controller/index.js'

// import { midtransWebhook, processTransaction } from '../controller/index.js'
const router = express.Router()
router.route('/charge').post(chargeTransaction)



export default router
