import express from 'express'
import { verifyToken } from '../../../middleware/verifyToken.js'
import { adminAndUserVerifiedAccess } from '../../../middleware/authMiddleware.js'
import {
  createExchangeRequest,
  getAllExchangeReward,
  updateStatusExchange,
} from '../controller/index.js'

const router = express.Router()

/* Get Route */
// router.route('/me').get([verifyToken], getPoinByUserId)
router.route('/list').get(getAllExchangeReward)

/* Post Route */
router.route('/create').post(createExchangeRequest)

/* Patch Route */
router.route('/update/:id').patch(updateStatusExchange)

// /* Patch Route */
// router.route('/update/:id').patch([verifyToken], updateUser)
// router
//   .route('/update-status/:id')
//   .patch([verifyToken, adminAndUserVerifiedAccess], updateStatusUser)

export default router
