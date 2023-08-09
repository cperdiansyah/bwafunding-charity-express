import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import dayjs from 'dayjs'

/* model */
import Reward from '../../reward/model/index.js'
import User from '../../user/model/index.js'

import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import { IExchange } from '../model/exchange.interface.js'
import Exchange from '../model/index.js'
import { SERVICE, api } from '../../../utils/api.js'

// @desc Fetch all exchange reward
// @route GET /api/v1/exchange/list
// @access Public
export const getAllExchangeReward = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const rows = parseInt(req.query.rows as string) || 10
    const status = (req.query.status as string) || 'pending' // get status from query params

    // const currentDate = new Date()
    const filter: any = {}

    if (status) {
      // check if status is one of 'pending', 'active', 'rejected', 'all'
      if (['pending', 'accept', 'rejected', 'all'].includes(status)) {
        // only add status to filter if it is not 'all'
        if (status !== 'all') {
          filter.status = status
        }
      } else {
        return res.status(400).json({
          error:
            "Invalid status. Status should be one of 'pending', 'active', 'rejected', 'all'",
        })
      }
    }

    const totalCount = await Exchange.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / rows)

    const dataExchange: IExchange[] = await Exchange.find(filter)
      .sort({ end_date: -1 })
      .skip((page - 1) * rows)
      .limit(rows)
      .populate({
        path: 'user_id',
      })
      .populate({
        path: 'reward_id',
      })
      .select('-__v')
      .exec()
    return res.status(200).json({
      data: dataExchange,
      meta: {
        page,
        rows,
        totalPages,
        total: totalCount,
      },
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc create point
// @route POST /api/v1/exchange/create
// @access Private
export const createExchangeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { user_id, reward_id } = req.body

    if (!user_id) {
      return res.status(400).json({
        code: 400,
        message: 'user_id  not found',
      })
    }
    const user = await User.findById(user_id)
    if (!user) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'user not found' } })
    }

    if (!reward_id) {
      return res.status(400).json({
        code: 400,
        message: 'reward_id  not found',
      })
    }

    const reward = await Reward.findById(reward_id)
    if (!reward) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'reward not found' } })
    }

    const dataExchangeRequest: IExchange = {
      user_id,
      reward_id,
      timestamp: dayjs().unix(),
      status: 'pending',
    }

    // Create exchange request
    await Exchange.create(dataExchangeRequest)

    /* Handle subtract point user */

    const dataPoint = {
      value: reward.price,
      type: 'subtract',
    }

    await api.patch(`${SERVICE.Point}/update/user/${user_id}`, dataPoint)

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      message: 'Exchange Reward created successfully',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    console.log(error)
    return errorHandler(error, res)
  }
}

// desc create approval exchange reward
// @route POST /api/v1/exchange/update
// @access Private
export const updateStatusExchange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { _id: exchangeId } = req.params
    const { status } = req.body

    if (!status) {
      return res
        .status(400)
        .json({ error: { code: 400, message: 'Status required' } })
    }

    if (status) {
      // check if status is one of 'pending', 'active', 'rejected', 'all'
      if (!['pending', 'accept', 'rejected'].includes(status)) {
        return res.status(400).json({
          error:
            "Invalid status. Status should be one of 'pending', 'active', 'rejected'",
        })
      }
    }

    const existingExchange = await Exchange.findById(exchangeId)
    if (!existingExchange) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Exchange not found' } })
    }

    const dataExchange: IExchange = {
      status,
    }

    const updatedExchange = await Exchange.updateOne(
      { _id: exchangeId },
      { $set: dataExchange }
    )

    if (updatedExchange.modifiedCount === 0) {
      return res
        .status(200)
        .json({ message: 'No changes made to the approval' })
    }

    const reward = await Reward.findById(existingExchange.reward_id)

    if (status === 'rejected') {
      const dataPoint = {
        value: reward?.price,
        type: 'subtract',
      }

      await api.patch(
        `${SERVICE.Point}/update/user/${existingExchange.user_id}`,
        dataPoint
      )
    }

    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({
      status: 'success',
      message: 'Exchange updated successfully',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}
