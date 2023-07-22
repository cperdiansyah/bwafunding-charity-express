import express from 'express'
import { verifyToken } from '../../../middleware/verifyToken.js'
import { adminAndUserVerifiedAccess } from '../../../middleware/authMiddleware.js'
import { getMe, updateStatusUser, updateUser } from '../controller/index.js'

const router = express.Router()

/* Get Route */
router.route('/me').get([verifyToken], getMe)

/* Patch Route */
router.route('/update/:id').patch([verifyToken], updateUser)
router
  .route('/update-status/:id')
  .patch([verifyToken, adminAndUserVerifiedAccess], updateStatusUser)

export default router
