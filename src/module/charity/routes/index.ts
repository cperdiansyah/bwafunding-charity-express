import express from 'express'
import {
  updateStatusCharity,
  crateCharity,
  deleteCharity,
  getAllCharity,
  getCharityById,
  getCharityBySlug,
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
router.route('/slug/:id').get([verifyAnonymousToken], getCharityBySlug)

// Post Router
router.route('/').post([verifyToken, adminAndUserVerifiedAccess], crateCharity)

// Patch Router
// update charity
router
  .route('/:id')
  .patch([verifyToken, adminAndUserVerifiedAccess], updateCharity)
// accept charity
router
  .route('/update-status/:id')
  .patch([verifyToken, adminAccess], updateStatusCharity)
// upload image
router.route('/upload').post(uploadCharitymedia)

// Delete Router
router.route('/:id').delete([verifyToken, adminAccess], deleteCharity)
export default router
