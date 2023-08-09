import express from 'express'
import { verifyToken } from '../../../middleware/verifyToken.js'
import { adminAndUserVerifiedAccess } from '../../../middleware/authMiddleware.js'
import {
  createPoint,
  getPoinByUserId,
  getPoinByUserIdSearch,
  getPoinHistoryList,
  updatePoin,
} from '../controller/index.js'

const router = express.Router()

/* Get Route */
router.route('/me').get([verifyToken], getPoinByUserId)
router.route('/history').get([verifyToken], getPoinHistoryList)
router.route('/user/:id').get(getPoinByUserIdSearch)

/* Post Route */
router.route('/create').post([verifyToken], createPoint)

/* Patch Route */
router.route('/update/user/:id').patch(updatePoin)

// /* Patch Route */
// router.route('/update/:id').patch([verifyToken], updateUser)
// router
//   .route('/update-status/:id')
//   .patch([verifyToken, adminAndUserVerifiedAccess], updateStatusUser)

export default router
