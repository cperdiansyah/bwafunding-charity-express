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
    const refModel = req.query.refModel as string

    const filter: any = {}
    if (refModel) {
      // check if refModel is one of 'User', 'Charity', 'Banner'
      if (['User', 'Charity', 'Banner'].includes(refModel)) {
        filter.refModel = refModel
      } else {
        return res.status(400).json({
          error:
            "Invalid refModel. refModel should be one of 'User', 'Charity', 'Banner'",
        })
      }
    }

    const totalCount = await Approval.countDocuments(filter)

    const approvals = await Approval.aggregate([
      { $match: filter },
      {
        $facet: {
          users: [
            { $match: { refModel: 'User' } },
            {
              $lookup: {
                from: 'users',
                localField: 'foreign_id',
                foreignField: '_id',
                as: 'foreign_data',
              },
            },
            { $unwind: '$foreign_data' },
            {
              $project: {
                password: 0,
                refresh_token: 0,
                'foreign_data.password': 0,
                'foreign_data.refresh_token': 0,
              },
            },
          ],
          charities: [
            { $match: { refModel: 'Charity' } },
            {
              $lookup: {
                from: 'charities',
                localField: 'foreign_id',
                foreignField: '_id',
                as: 'foreign_data',
              },
            },
            { $unwind: '$foreign_data' },
          ],
          banners: [
            { $match: { refModel: 'Banner' } },
            {
              $lookup: {
                from: 'banners',
                localField: 'foreign_id',
                foreignField: '_id',
                as: 'foreign_data',
              },
            },
            { $unwind: '$foreign_data' },
          ],
        },
      },
      {
        $project: {
          approval: { $setUnion: ['$users', '$charities', '$banners'] },
        },
      },
      { $unwind: '$approval' },
      { $replaceRoot: { newRoot: '$approval' } },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * rows },
      { $limit: rows },
    ])

    return res.status(200).json({
      data: approvals,
      meta: {
        page,
        rows,
        totalPages: Math.ceil(totalCount / rows),
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
    const approval = await Approval.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $facet: {
          users: [
            { $match: { refModel: 'User' } },
            {
              $lookup: {
                from: 'users',
                localField: 'foreign_id',
                foreignField: '_id',
                as: 'foreign_data',
              },
            },
            { $unwind: '$foreign_data' },
            {
              $project: {
                password: 0,
                refresh_token: 0,
                'foreign_data.password': 0,
                'foreign_data.refresh_token': 0,
              },
            }, // Exclude sensitive fields
          ],
          charities: [
            { $match: { refModel: 'Charity' } },
            {
              $lookup: {
                from: 'charities',
                localField: 'foreign_id',
                foreignField: '_id',
                as: 'foreign_data',
              },
            },
            { $unwind: '$foreign_data' },
          ],
          banners: [
            { $match: { refModel: 'Banner' } },
            {
              $lookup: {
                from: 'banners',
                localField: 'foreign_id',
                foreignField: '_id',
                as: 'foreign_data',
              },
            },
            { $unwind: '$foreign_data' },
          ],
        },
      },
      {
        $project: {
          approval: { $setUnion: ['$users', '$charities', '$banners'] },
        },
      },
      { $unwind: '$approval' },
      { $replaceRoot: { newRoot: '$approval' } },
    ])

    if (approval.length === 0) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Approval not found',
        },
      })
    }
    return res.status(200).json({
      data: approval[0],
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
    const approval = await Approval.aggregate([
      { $match: { foreign_id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $facet: {
          users: [
            { $match: { refModel: 'User' } },
            {
              $lookup: {
                from: 'users',
                localField: 'foreign_id',
                foreignField: '_id',
                as: 'foreign_data',
              },
            },
            { $unwind: '$foreign_data' },
            {
              $project: {
                password: 0,
                refresh_token: 0,
                'foreign_data.password': 0,
                'foreign_data.refresh_token': 0,
              },
            }, // Exclude sensitive fields
          ],
          charities: [
            { $match: { refModel: 'Charity' } },
            {
              $lookup: {
                from: 'charities',
                localField: 'foreign_id',
                foreignField: '_id',
                as: 'foreign_data',
              },
            },
            { $unwind: '$foreign_data' },
          ],
          banners: [
            { $match: { refModel: 'Banner' } },
            {
              $lookup: {
                from: 'banners',
                localField: 'foreign_id',
                foreignField: '_id',
                as: 'foreign_data',
              },
            },
            { $unwind: '$foreign_data' },
          ],
        },
      },
      {
        $project: {
          approval: { $setUnion: ['$users', '$charities', '$banners'] },
        },
      },
      { $unwind: '$approval' },
      { $replaceRoot: { newRoot: '$approval' } },
    ])

    if (approval.length === 0) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Approval not found',
        },
      })
    }
    return res.status(200).json({
      data: approval[0],
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
    let { approval_type, foreign_id, status = 'pending', refModel } = req.body
    const dataApproval: IApproval = {
      approval_type,
      foreign_id,
      status,
      refModel,
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
    const { approval_type, foreign_id, status, refModel } = req.body // Updated data

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
      refModel,
    }

    const updatedApproval = await Approval.updateOne(
      { _id: id },
      { $set: dataApproval }
    )
    if (updatedApproval.modifiedCount === 0) {
      return res
        .status(200)
        .json({ message: 'No changes made to the approval' })
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
// @route POST /api/v1/approval/update-by-foreign-id/:id
// @access Private
export const updateApprovalByForeignId = async (
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
    const existingApproval = await Approval.findOne({
      foreign_id: id,
    })
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
      { _id: existingApproval._id },
      { $set: dataApproval }
    )
    if (updatedApproval.modifiedCount === 0) {
      return res
        .status(200)
        .json({ message: 'No changes made to the approval' })
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
