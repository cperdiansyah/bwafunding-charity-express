import { NextFunction, Request, Response } from 'express'
import Charity from '../model'
import { ICharity } from '../model/charityInterface'
import { errorHandler } from '../../../utils/helpers/errorHandler'

// @desc Fetch all charities
// @route GET /api/v1/charity
// @access Public
export const getAllCharity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const charities: ICharity[] = await Charity.find({})
      .populate({
        path: 'author',
        select: 'name',
      })
      .select('-__v')
      .exec()
    return res.status(200).json({
      charity: charities,
      stats: charities.length,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc Get a single charities
// @route GET /api/v1/charity/:id
// @access Public
export const getCharityById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const charity: ICharity | null = await Charity.findById(req.params.id)
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
      charity: charity,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
