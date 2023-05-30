import express from 'express'
import { login, logout, register } from '../controller/index.js'

const router = express.Router()

router.post('/login', login)
router.post('/logout', logout)
router.post('/register', register)

export default router
