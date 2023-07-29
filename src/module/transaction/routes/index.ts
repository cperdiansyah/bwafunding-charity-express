import express from 'express'
import {
  chargeTransaction,
  chargeTransactionSedekahSubuh,
  checkStatus,
  gePaymentByIdCharity,
  getAllCharityPayment,
  getPaymentById,
  getPaymentByIdUser,
  notificationPush,
} from '../controller/index.js'

// import { midtransWebhook, processTransaction } from '../controller/index.js'
const router = express.Router()
/* Get */
router.route('/list').get(getAllCharityPayment)
router.route('/:id').get(getPaymentById)
router.route('/user/:id').get(getPaymentByIdUser)
router.route('/charity/:id').get(gePaymentByIdCharity)
router.route('/check-status/:id').get(checkStatus)

/* post */
router.route('/charge').post(chargeTransaction)
router.route('/charge/sedekah-subuh').post(chargeTransactionSedekahSubuh)
router.route('/notification-push').post(notificationPush)

export default router
