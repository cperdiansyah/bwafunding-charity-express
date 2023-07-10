import express from 'express'
import { createTransaction } from '../controller/index.js'

const router = express.Router()

/* Post */
router.route('/create-transaction').post(createTransaction)



export default router
