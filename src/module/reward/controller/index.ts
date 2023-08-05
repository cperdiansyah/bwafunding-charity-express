import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import dayjs from 'dayjs'

/* model */

import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import Reward from '../model/index.js'

// desc get point
// @route GET /api/v1/point/me
// @access Private
export const getRewardList = async (req: Request, res: Response) => {
  try {
    const reward = await Reward.find({}).select('-__v')

    return res.status(200).json({
      reward,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
