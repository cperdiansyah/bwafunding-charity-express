import express from 'express'
import { midtransWebhook, processTransaction } from '../controller/index.js'
const router = express.Router()

router.route('/process-transaction').post(processTransaction)
router.route('/notification-push').post(midtransWebhook)


export default router
