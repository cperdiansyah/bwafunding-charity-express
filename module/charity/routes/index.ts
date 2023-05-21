import express from 'express'
import { crateCharity, getAllCharity, getCharityById } from '../controller'
import {
  adminAndUserVerifiedAccess,
  protect,
} from '../../../middleware/authMiddleware'

const router = express.Router()

// Get Router
router.get('/', getAllCharity)
router.get('/:id', getCharityById)

// Post Router
router.route('/').post([protect, adminAndUserVerifiedAccess], crateCharity)

export default router
