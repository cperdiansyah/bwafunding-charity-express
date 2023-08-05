import { NextFunction, Request, Response } from 'express'
import { ICharity } from '../model/charityInterface.js'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import Charity from '../model/index.js'

// desc Get a single charities
// @route GET /api/v1/charity/sedekah-subuh
// @access Public
export const getSedekahSubuhCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const charity = await Charity.findOne({
      campaign_type: { $eq: 'sedekah-subuh' },
    })
      .populate({
        path: 'author',
        select: 'name',
      })
      .select('-__v')
    if (charity === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Charity not found',
        },
      })
    }
    return res.status(200).json({
      campaign: charity,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
