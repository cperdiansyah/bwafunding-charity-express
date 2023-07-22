import express from 'express'
import {
  verifyAnonymousToken,
  verifyToken,
} from '../../../middleware/verifyToken.js'
import {
  crateApproval,
  getAllApproval,
  getApprovalByForeignId,
  getApprovalById,
  updateApproval,
  updateApprovalByForeignId,
} from '../controller/index.js'
import { adminAndUserVerifiedAccess } from '../../../middleware/authMiddleware.js'
const router = express.Router()

// Get Router
router.route('/list').get([verifyAnonymousToken], getAllApproval)
router.route('/:id').get([verifyAnonymousToken], getApprovalById)
router.route('/foreign/:id').get([verifyAnonymousToken], getApprovalByForeignId)

// Post Router
router
  .route('/create')
  .post([verifyToken, adminAndUserVerifiedAccess], crateApproval)

// Patch Router
router
  .route('/update/:id')
  .patch([verifyToken, adminAndUserVerifiedAccess], updateApproval)
router
  .route('/update-by-foreign-id/:id')
  .patch([verifyToken, adminAndUserVerifiedAccess], updateApprovalByForeignId)

export default router
