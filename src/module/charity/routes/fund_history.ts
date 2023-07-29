import express from 'express'
import {
  crateCharityFundingHistory,
  getAllCharityFundHistory,
  getCharityFundHistoryByCampaignId,
  getCharityFundHistoryById,
  getCharityFundHistoryByTransactionId,
  updateCharityFundingHistory,
  updateCharityFundingHistoryByTransactionId,
} from '../controller/fund_history.js'
import { verifyToken } from '../../../middleware/verifyToken.js'
const router = express.Router()

/* Get Routes */

router.route('/list').get([verifyToken], getAllCharityFundHistory)
router.route('/:id').get([verifyToken], getCharityFundHistoryById)
router
  .route('/campaign/:id')
  .get([verifyToken], getCharityFundHistoryByCampaignId)
router
  .route('/transaction/:id')
  .get([verifyToken], getCharityFundHistoryByTransactionId)

/* Post Routes */
router.route('/create').post([verifyToken], crateCharityFundingHistory)

/* Patch Routes */
router.route('/update/:id').patch([verifyToken], updateCharityFundingHistory)
router
  .route('/update/transaction/:id')
  .patch([verifyToken], updateCharityFundingHistoryByTransactionId)

export default router
