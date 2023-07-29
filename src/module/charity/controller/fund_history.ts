import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import CharityFundHistory from '../model/fund_history.js'
import { ICharityFundHistory } from '../model/charityInterface.js'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import dayjs from 'dayjs'

// @desc Fetch all charities fund history
// @route GET /api/v1/charity-fund-history/list
// @access Public
export const getAllCharityFundHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const rows = parseInt(req.query.rows as string) || 10

    const totalCount = await CharityFundHistory.countDocuments({})
    const totalPages = Math.ceil(totalCount / rows)

    const charities: ICharityFundHistory[] = await CharityFundHistory.find({})
      .sort({ end_date: 1 })
      .skip((page - 1) * rows)
      .limit(rows)
      .populate({
        path: 'author',
        select: 'name',
      })
      .select('-__v')
      .exec()
    return res.status(200).json({
      data: charities,
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

// desc Get a single charities
// @route GET /api/v1/charity-fund-history/:id
// @access Public
export const getCharityFundHistoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const charity: ICharityFundHistory | null =
      await CharityFundHistory.findById(req.params.id)
        .populate({
          path: 'campaign_id',
          // select: 'name',
        })
        .populate({
          path: 'transaction_id',
        })
        .select('-__v')
    if (charity === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Charity Fund History not found',
        },
      })
    }
    return res.status(200).json({
      data: charity,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
// desc Get a single charities by campaign id
// @route GET /api/v1/charity-fund-history/campaign/:id
// @access Public
export const getCharityFundHistoryByCampaignId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const charity: ICharityFundHistory[] | null = await CharityFundHistory.find(
      {
        campaign_id: req.params.id,
      }
    )
      .populate({
        path: 'campaign_id',
      })
      .populate({
        path: 'transaction_id',
      })
      .select('-__v')
    if (charity === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Charity Fund History not found',
        },
      })
    }
    return res.status(200).json({
      data: charity,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
// desc Get a single charities by transcation id
// @route GET /api/v1/charity-fund-history/transcation/:id
// @access Public
export const getCharityFundHistoryByTransactionId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const charity: ICharityFundHistory | null =
      await CharityFundHistory.findOne({
        transaction_id: req.params.id,
      })
        .populate({
          path: 'campaign_id',
        })
        .populate({
          path: 'transaction_id',
        })
        .select('-__v')
    if (charity === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Charity Fund History not found',
        },
      })
    }
    return res.status(200).json({
      data: charity,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc create approval request
// @route POST /api/v1/approval/create
// @access Private
export const crateCharityFundingHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    let { campaign_id, transaction_id, status = 'pending' } = req.body

    const dataApproval: ICharityFundHistory = {
      campaign_id,
      transaction_id,
      funding_status: status,
      timestamp: dayjs().unix(),
    }

    const approval = await CharityFundHistory.create(dataApproval)
    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      content: approval,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// desc update approval request
// @route POST /api/v1/approval/update/:id
// @access Private
export const updateCharityFundingHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the approval to update
    const { campaign_id, transaction_id, status } = req.body // Updated data

    // Find the approval by ID
    const existingApproval = await CharityFundHistory.findById(id)
    if (!existingApproval) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Fund History not found' } })
    }

    const dataApproval: ICharityFundHistory = {
      campaign_id,
      transaction_id,
      funding_status: status,
      timestamp: dayjs().unix(),
    }

    const updatedApproval = await CharityFundHistory.updateOne(
      { _id: id },
      { $set: dataApproval }
    )
    if (updatedApproval.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to the charity' })
    }

    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({
      status: 'success',
      message: 'Approval updated successfully',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}
// desc update approval request
// @route POST /api/v1/approval/update/:id
// @access Private
export const updateCharityFundingHistoryByTransactionId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the approval to update
    const { campaign_id, status } = req.body // Updated data

    // Find the approval by ID
    const existingApproval = await CharityFundHistory.findOne({
      transaction_id: { $eq: id },
    })
    if (!existingApproval) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Campaign Fund History not found' } })
    }

    const dataApproval: ICharityFundHistory = {
      campaign_id,
      funding_status: status,
      timestamp: dayjs().unix(),
    }

    const updatedApproval = await CharityFundHistory.updateOne(
      { _id: id },
      { $set: dataApproval }
    )
    if (updatedApproval.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to the charity' })
    }

    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({
      status: 'success',
      message: 'Approval updated successfully',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}
