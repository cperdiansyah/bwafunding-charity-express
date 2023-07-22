import express from 'express'
import { verifyAnonymousToken, verifyToken } from '../../../middleware/verifyToken.js'
import { createApprovalUser, getApprovalByUserId, updateApprovalUser } from '../controller/approval_user.js'
const router = express.Router()

/* Get Routes */
router.route('/user/:id').get([verifyToken], getApprovalByUserId)

/* Post Routes */
// Post Router
router.route('/create').post([verifyToken], createApprovalUser)

/* Patch Routes */
router.route('/update/:id').patch([verifyToken], updateApprovalUser)

export default router
