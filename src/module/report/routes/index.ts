import express from 'express'
import { verifyToken } from '../../../middleware/verifyToken.js'
import { adminAndUserVerifiedAccess } from '../../../middleware/authMiddleware.js'
import { generateCampaignReport, previewCampaignReport } from '../controller/index.js'

const router = express.Router()

// /* Get Route */
// router
router
  .route('/campaign/:id')
  .get([verifyToken, adminAndUserVerifiedAccess], generateCampaignReport)

router.route('/preview-campaign/:id').get(previewCampaignReport)
// router.route('/list').get(getRewardList)
// router.route('/:id').get(getRewardById)

// /* Post Route */
// router.route('/create').post(createReward)
// router.route('/upload').post(uploadRewardMedia)

// /* Patch Route */
// router.route('/update/:id').patch(updateReward)

// /* Delete Route */
// router.route('/delete/:id').delete(deleteReward)

export default router
