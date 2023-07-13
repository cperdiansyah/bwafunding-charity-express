import express from 'express'
import {
  createTransaction,
  gePaymentByIdCharity,
  getPaymentByIdUser,
  getAllCharityPayment,
  getPaymentById,
  updateMidtransResponse,
  updateStatusTransaction,
  updateTransaction,
} from '../controller/index.js'

const router = express.Router()
/* Get */
router.route('/list').get(getAllCharityPayment)
router.route('/:id').get(getPaymentById)
router.route('/user/:id').get(getPaymentByIdUser)
router.route('/charity/:id').get(gePaymentByIdCharity)
/* Post */
router.route('/create-transaction').post(createTransaction)

// Patch Router
// update payment transaction
router.route('/update-transaction/:id').patch(updateTransaction)
router.route('/add-midtrans-response/:id').patch(updateMidtransResponse)
router.route('/update-status/:id').patch(updateStatusTransaction)

export default router
