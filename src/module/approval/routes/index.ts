import express from 'express'
import { verifyAnonymousToken } from '../../../middleware/verifyToken.js'
import { getAllApproval, getApprovalByForeignId, getApprovalById } from '../controller/index.js'
const router = express.Router()

// Get Router
router.route('/list').get([verifyAnonymousToken], getAllApproval)
router.route('/:id').get([verifyAnonymousToken], getApprovalById)
router.route('/foreign/:id').get([verifyAnonymousToken], getApprovalByForeignId)

// Post Router



export default router
