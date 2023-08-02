import express from 'express'
import { verifyToken } from '../../../middleware/verifyToken.js'
import { adminAndUserVerifiedAccess } from '../../../middleware/authMiddleware.js'
import { getConfig, updateConfig } from '../controller/index.js'

const router = express.Router()

/* Get Route */
router.route('/').get(getConfig)

router
  .route('/update')
  .patch([verifyToken, adminAndUserVerifiedAccess], updateConfig)
export default router
