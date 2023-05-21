import express from 'express'
import {
  acceptCharity,
  crateCharity,
  deleteCharity,
  getAllCharity,
  getCharityById,
  updateCharity,
} from '../controller'
import {
  adminAndUserVerifiedAccess,
  admindAccess,
  protect,
} from '../../../middleware/authMiddleware'

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
router.route('/:id/status').patch([protect, admindAccess], acceptCharity)

// Delete Router
router.route('/:id').delete([protect, admindAccess], deleteCharity)
export default router
