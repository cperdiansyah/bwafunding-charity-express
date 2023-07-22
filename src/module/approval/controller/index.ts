import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'

/* Model */
import Approval from '../model/index.js'
import Charity from '../../charity/model/index.js'
import User from '../../user/model/index.js'
import Banner from '../../banner/model/index.js'

import { IApproval } from '../model/approval.interface.js'

// @desc Fetch all approval
// @route GET /api/v1/approval/list
// @access Public
export const getAllApproval = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const rows = parseInt(req.query.rows as string) || 10

    const totalCount = await Approval.countDocuments({})
    const totalPages = Math.ceil(totalCount / rows)
    // const currentDate = new Date()

    const approval: IApproval[] = await Approval.find({})
      .sort({ end_date: 1 })
      .skip((page - 1) * rows)
      .limit(rows)
      .populate({
        path: 'foreign_id',
        // select: 'name',
      })
      .select('-__v')
      .exec()
    return res.status(200).json({
      data: approval,
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

// desc Get a single approval
// @route GET /api/v1/approval/:id
// @access Public
export const getApprovalById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const approval: IApproval | null = await Approval.findById(req.params.id)
      .populate({
        path: 'foreign_id',
        // select: 'name',
      })
      .select('-__v')
    if (approval === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Approval not found',
        },
      })
    }
    return res.status(200).json({
      data: approval,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
// desc Get a single approval by foreign id
// @route GET /api/v1/approval/foreign/:id
// @access Public
export const getApprovalByForeignId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const approval: IApproval | null = await Approval.findOne({
      foreign_id: req.params.id,
    })
      .populate({
        path: 'foreign_id',
      })
      .select('-__v')
    if (approval === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Approval not found',
        },
      })
    }
    return res.status(200).json({
      data: approval,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc create approval request
// @route POST /api/v1/approval/create
// @access Private
export const crateApproval = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    let { approval_type, foreign_id, status = 'pending' } = req.body
    const dataApproval: IApproval = {
      approval_type,
      foreign_id,
      status,
    }

    let foreginData

    if (approval_type === 'charity') {
      foreginData = await Charity.findById(foreign_id)
    } else if (approval_type === 'user') {
      foreginData = await User.findById(foreign_id)
    } else {
      foreginData = await Banner.findById(foreign_id)
    }

    if (foreginData === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: `Foreign_id not found in ${approval_type}`,
        },
      })
    }
    const approval = await Approval.create(dataApproval)
    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      content: approval,
    })
  } catch (error) {
    // console.log(error)
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// desc update approval request
// @route POST /api/v1/approval/update/:id
// @access Private
export const updateApproval = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the approval to update
    const { approval_type, foreign_id, status } = req.body // Updated data

    // Find the approval by ID
    const existingApproval = await Approval.findById(id)
    if (!existingApproval) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Approval not found' } })
    }

    const dataApproval: IApproval = {
      approval_type,
      foreign_id,
      status,
    }

    const updatedApproval = await Approval.updateOne(
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
