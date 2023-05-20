import express from 'express'
import { getAllCharity, getCharityById } from '../controller'

const router = express.Router()

router.get('/', getAllCharity)
router.get('/:id', getCharityById)


export default router
