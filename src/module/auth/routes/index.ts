import express from 'express'
import { anonymousToken, login, logout, register } from '../controller/index.js'
import { refreshToken } from '../../../middleware/refreshToken.js'

const router = express.Router()

router.post('/login', login)
router.post('/logout', logout)
router.post('/register', register)

// Anon token
router.post('/anonymous', anonymousToken)

// Refresh token
router.post('/refresh', refreshToken)

export default router
