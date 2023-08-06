import express from 'express'
import { verifyToken } from '../../../middleware/verifyToken.js'
import { adminAndUserVerifiedAccess } from '../../../middleware/authMiddleware.js'
import {
  createReward,
  deleteReward,
  getRewardList,
  updateReward,
} from '../controller/index.js'

const router = express.Router()

/* Get Route */
router.route('/list').get(getRewardList)

/* Post Route */
router.route('/create').post(createReward)

/* Patch Route */
router.route('/update/:id').patch(updateReward)

/* Delete Route */
router.route('/delete/:id').delete(deleteReward)

export default router
