import express from 'express'
import { anonymousToken, checkAccount, login, logout, register, resetPassword } from '../controller/index.js'
import { refreshToken } from '../../../middleware/refreshToken.js'

const router = express.Router()

router.post('/login', login)
router.post('/logout', logout)
router.post('/register', register)
router.post('/check-account', checkAccount)
router.post('/reset-password', resetPassword)

// Anon token
router.post('/anonymous', anonymousToken)

// Refresh token
router.post('/refresh', refreshToken)

export default router
