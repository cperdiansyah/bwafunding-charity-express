import express from 'express'
import {
  chargeTransaction,
  checkStatus,
  gePaymentByIdCharity,
  getAllCharityPayment,
  getPaymentById,
  getPaymentByIdUser,
  notificationPush,
} from '../controller/index.js'
import { verifyToken } from '../../../middleware/verifyToken.js'
import { chargeTransactionSedekahSubuh } from '../controller/sedekahSubuh.js'

// import { midtransWebhook, processTransaction } from '../controller/index.js'
const router = express.Router()
/* Get */
router.route('/list').get(getAllCharityPayment)
router.route('/:id').get([verifyToken], getPaymentById)
router.route('/user/:id').get([verifyToken], getPaymentByIdUser)
router.route('/charity/:id').get([verifyToken], gePaymentByIdCharity)
router.route('/check-status/:id').get([verifyToken], checkStatus)

/* post */
router.route('/charge').post([verifyToken], chargeTransaction)
router
  .route('/charge/sedekah-subuh')
  .post([verifyToken], chargeTransactionSedekahSubuh)
router.route('/notification-push').post(notificationPush)

export default router
