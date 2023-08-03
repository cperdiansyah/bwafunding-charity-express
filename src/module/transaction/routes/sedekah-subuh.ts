import express from 'express'
import {
  getAllSedekahSubuhPayment,
  getSedekahSubuhPaymentByUserId,
} from '../controller/sedekahSubuh.js'
import { verifyToken } from '../../../middleware/verifyToken.js'
const router = express.Router()

router.route('/list').get(getAllSedekahSubuhPayment)
router.route('/user/:id').get([verifyToken], getSedekahSubuhPaymentByUserId)

export default router
