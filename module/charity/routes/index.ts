import express from 'express'
import { crateCharity, getAllCharity, getCharityById } from '../controller'

const router = express.Router()

// Get Router
router.get('/', getAllCharity)
router.get('/:id', getCharityById)

// Post Router
router.post('/', crateCharity)


export default router
