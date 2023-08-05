import express from 'express'
import { verifyToken } from '../../../middleware/verifyToken.js'
import { adminAndUserVerifiedAccess } from '../../../middleware/authMiddleware.js'
import { getRewardList } from '../controller/index.js'

const router = express.Router()

/* Get Route */
router.route('/list').get(getRewardList)

/* Post Route */
// router.route('/create').post(createPoint)

/* Patch Route */
// router.route('/update/user/:id').patch(updatePoin)

// /* Patch Route */
// router.route('/update/:id').patch([verifyToken], updateUser)
// router
//   .route('/update-status/:id')
//   .patch([verifyToken, adminAndUserVerifiedAccess], updateStatusUser)

export default router
