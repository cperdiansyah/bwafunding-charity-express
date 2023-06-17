import express from 'express'
import { verifyAnonymousToken } from '../../../middleware/verifyToken.js'
import { postTempMedia } from '../controller/index.js'
const router = express.Router()

// Post Media
router.route('/upload').post([verifyAnonymousToken], postTempMedia)

export default router
