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

import approvalUserRoutes from './approval_user.js'

const router = express.Router()

/* Approval User Routes */
// app.use('/api/v1/transaction', transactionRoutes)
router.use('/approval-user', approvalUserRoutes)

// Get Router
router.route('/list').get([verifyAnonymousToken], getAllApproval)
router.route('/:id').get([verifyAnonymousToken], getApprovalById)
router.route('/foreign/:id').get([verifyAnonymousToken], getApprovalByForeignId)

// Post Router
router.route('/create').post([verifyToken], crateApproval)

// Patch Router
router
  .route('/update/:id')
  .patch([verifyToken, adminAndUserVerifiedAccess], updateApproval)
router
  .route('/update-by-foreign-id/:id')
  .patch([verifyToken, adminAndUserVerifiedAccess], updateApprovalByForeignId)

export default router
