import express from 'express'
import { verifyToken } from '../../../middleware/verifyToken.js'
import { postTempMedia } from '../controller/index.js'
const router = express.Router()

// Post Media
router.route('/upload').post([verifyToken], postTempMedia)

export default router
