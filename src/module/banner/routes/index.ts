import express from 'express'
import { verifyToken } from '../../../middleware/verifyToken.js'
import {
  crateBanner,
  getAllBanner,
  getBannerById,
} from '../controller/index.js'
const router = express.Router()

// Get Method
router.route('/').get([verifyToken], getAllBanner)
router.route('/:id').get([verifyToken], getBannerById)

// Post Media
// router.route('/list').post([verifyToken], getAllBanner)
router.route('/create').post([verifyToken], crateBanner)

export default router
