import express from 'express'
import { verifyToken } from '../../../middleware/verifyToken.js'
import { adminAndUserVerifiedAccess } from '../../../middleware/authMiddleware.js'
import { generateCampaignReport, previewCampaignReport } from '../controller/index.js'
import { generateSedekahSubuhReport, previewSedekahSubuhReport } from '../controller/sedekah-subuh.js'

const router = express.Router()

// /* Get Route */
// router
router
  .route('/campaign/:id')
  .get([verifyToken, adminAndUserVerifiedAccess], generateCampaignReport)
router
  .route('/sedekah-subuh')
  .get([verifyToken, adminAndUserVerifiedAccess], generateSedekahSubuhReport)

router.route('/preview-campaign/:id').get(previewCampaignReport)

router.route('/preview-sedekah').get(previewSedekahSubuhReport)

export default router
