import express from 'express'
import {
  acceptCharity,
  crateCharity,
  deleteCharity,
  getAllCharity,
  getCharityById,
  updateCharity,
  uploadCharitymedia,
} from '../controller/index.js'
import {
  adminAndUserVerifiedAccess,
  adminAccess,
} from '../../../middleware/authMiddleware.js'
import {
  verifyAnonymousToken,
  verifyToken,
} from '../../../middleware/verifyToken.js'

const router = express.Router()

// Get Router
router.route('/').get([verifyAnonymousToken], getAllCharity)
router.route('/:id').get([verifyAnonymousToken], getCharityById)

// Post Router
router.route('/').post([verifyToken, adminAndUserVerifiedAccess], crateCharity)

// Patch Router
// update charity
router
  .route('/:id')
  .patch([verifyToken, adminAndUserVerifiedAccess], updateCharity)
// accept charity
router.route('/:id/status').patch([verifyToken, adminAccess], acceptCharity)
// upload image
router.route('/upload').post(uploadCharitymedia)

// Delete Router
router.route('/:id').delete([verifyToken, adminAccess], deleteCharity)
export default router
