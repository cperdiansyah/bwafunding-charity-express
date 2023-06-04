import express from 'express'
import {
  acceptCharity,
  crateCharity,
  deleteCharity,
  getAllCharity,
  getCharityById,
  updateCharity,
} from '../controller/index.js'
import {
  adminAndUserVerifiedAccess,
  adminAccess,
  protect,
} from '../../../middleware/authMiddleware.js'

const router = express.Router()

// Get Router
router.get('/', getAllCharity)
router.get('/:id', getCharityById)

// Post Router
router.route('/').post([protect, adminAndUserVerifiedAccess], crateCharity)

// Patch Router
// update charity
router.route('/:id').patch([protect, adminAndUserVerifiedAccess], updateCharity)
// accept charity
router.route('/:id/status').patch([protect, adminAccess], acceptCharity)

// Delete Router
router.route('/:id').delete([protect, adminAccess], deleteCharity)
export default router
