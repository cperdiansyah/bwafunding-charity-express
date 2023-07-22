import express from 'express'
import { verifyToken } from '../../../middleware/verifyToken.js'
import {
  crateBanner,
  deleteBanner,
  getAllBanner,
  getBannerById,
  updateBanner,
  updateStatusBanner,
} from '../controller/index.js'
import {
  adminAccess,
  adminAndUserVerifiedAccess,
} from '../../../middleware/authMiddleware.js'
const router = express.Router()

// Get Method
router.route('/').get([verifyToken], getAllBanner)
router.route('/:id').get([verifyToken], getBannerById)

// Post Media
// router.route('/list').post([verifyToken], getAllBanner)
router.route('/create').post([verifyToken], crateBanner)

// Patch Router
// update charity
router
  .route('/:id')
  .patch([verifyToken, adminAndUserVerifiedAccess], updateBanner)
router
  .route('/update-status/:id')
  .patch([verifyToken, adminAndUserVerifiedAccess], updateStatusBanner)

// Delete Router
router.route('/:id').delete([verifyToken, adminAccess], deleteBanner)

export default router
