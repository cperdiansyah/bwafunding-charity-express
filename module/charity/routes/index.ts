import express from 'express'
import { crateCharity, getAllCharity, getCharityById } from '../controller'
import { protect } from '../../../middleware/authMiddleware'

const router = express.Router()

// Get Router
router.get('/', getAllCharity)
router.get('/:id', getCharityById)

// Post Router
router.route('/').post(protect, crateCharity)


export default router
