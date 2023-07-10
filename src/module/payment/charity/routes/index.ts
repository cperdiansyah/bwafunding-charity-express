import express from 'express'
import {
  createTransaction,
  getAllCharityPayment,
  getPaymentById,
} from '../controller/index.js'

const router = express.Router()
/* Get */
router.route('/list').get(getAllCharityPayment)
router.route('/:id').get(getPaymentById)
/* Post */
router.route('/create-transaction').post(createTransaction)

export default router
