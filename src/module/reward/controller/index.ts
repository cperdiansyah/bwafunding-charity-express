import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

/* model */
import Reward from '../model/index.js'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
/* Inferface */
import { IReward } from '../model/reward.interface.js'

// desc get point
// @route GET /api/v1/reward/list
// @access Private
export const getRewardList = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const rows = parseInt(req.query.rows as string) || 10
    const keyword = req.query.keyword
    const showDeleted = req.query.showDeleted === 'true' // make sure you get a boolean

    const filter: any = {}

    if (keyword) {
      filter.name = new RegExp(`/.*${keyword}.*/`, 'i')
    }
    if (!showDeleted) {
      filter.deletedAt = { $eq: null } // only not deleted rewards
    }

    const totalCount = await Reward.countDocuments(filter)
    const totalPages = Math.ceil(totalCount / rows)

    const reward: IReward[] = await Reward.find(filter)
      .skip((page - 1) * rows)
      .limit(rows)
      .select('-__v')
      .exec()
    return res.status(200).json({
      data: reward,
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

// desc create charity
// @route POST /api/v1/reward/create
// @access Private
export const createReward = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { name, image = null, price } = req.body

    const dataReward: IReward = { name, image, price: Number(price) }

    const charity = await Reward.create(dataReward)

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      data: charity,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}
// desc create reward
// @route POST /api/v1/reward/update/:id
// @access Private
export const updateReward = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the charity to update
    const { name, image, price } = req.body

    const existingReward = await Reward.findById(id)
    if (!existingReward) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Reward not found' } })
    }

    const dataReward: IReward = { name, image, price }
    const updatedReward = await Reward.findOneAndUpdate(
      { _id: id },
      { $set: dataReward },
      { new: true }
    )

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      data: updatedReward,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// desc create rewawrd
// @route Delete /api/v1/reward/delete/:id
// @access Private

export const deleteReward = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the charity to update

    const existingReward = await Reward.findById(id)
    if (!existingReward) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Reward not found' } })
    }

    const updatedReward = await Reward.findOneAndUpdate(
      { _id: id },
      { $set: { deletedAt: new Date() } },
      { new: true }
    )

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      data: updatedReward,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}
