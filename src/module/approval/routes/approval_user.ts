import express from 'express'
import {
  verifyAnonymousToken,
  verifyToken,
} from '../../../middleware/verifyToken.js'
import {
  createApprovalUser,
  getAllApprovalUser,
  getApprovalByUserId,
  updateApprovalUser,
  getApprovalUserById,
} from '../controller/approval_user.js'
const router = express.Router()

/* Get Routes */
router.route('/list').get([verifyToken], getAllApprovalUser)
router.route('/:id').get([verifyToken], getApprovalUserById)
router.route('/user/:id').get([verifyToken], getApprovalByUserId)

/* Post Routes */
// Post Router
router.route('/create').post([verifyToken], createApprovalUser)

/* Patch Routes */
router.route('/update/:id').patch([verifyToken], updateApprovalUser)

export default router
