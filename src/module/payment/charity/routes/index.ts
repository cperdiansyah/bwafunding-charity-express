import express from 'express'
import {
  createTransaction,
  getAllCharityPayment,
  getPaymentById,
  updateTransaction,
} from '../controller/index.js'

const router = express.Router()
/* Get */
router.route('/list').get(getAllCharityPayment)
router.route('/:id').get(getPaymentById)
/* Post */
router.route('/create-transaction').post(createTransaction)

// Patch Router
// update payment transaction
router.route('/update-transaction/:id').patch(updateTransaction)
router.route('/add-midtrans-response/:id').patch(updateTransaction)


export default router
