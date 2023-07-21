import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import Approval from '../model/index.js'
import { IApproval } from '../model/approval.interface.js'

// @desc Fetch all approval
// @route GET /api/v1/approval/list
// @access Public
export const getAllApproval = async (
  req: Request,
  res: Response,
) => {
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
