import { NextFunction, Request, Response } from 'express'
import Charity from '../model/index.js'
import {
  IAcceptCharityData,
  ICharity,
  RequestWithUserRole,
} from '../model/charityInterface.js'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import { slugify } from '../../../utils/helpers/slug.js'

// @desc Fetch all charities
// @route GET /api/v1/charity
// @access Public
export const getAllCharity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const rows = parseInt(req.query.rows as string) || 10

    const totalCount = await Charity.countDocuments({})
    const totalPages = Math.ceil(totalCount / rows)

    const charities: ICharity[] = await Charity.find({})
      .skip((page - 1) * rows)
      .limit(rows)
      .populate({
        path: 'author',
        select: 'name',
      })
      .select('-__v')
      .exec()
    return res.status(200).json({
      charity: charities,
      stats: {
        page,
        rows,
        totalPages,
        totalCount,
      },
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

// desc create charity
// @route POST /api/v1/charity/
// @access Private
export const crateCharity = async (
  req: RequestWithUserRole,
  res: Response,
  next: NextFunction
) => {
  try {
    let {
      title,
      description,
      donation_target,
      start_date,
      end_date,
      status = 'inactive',
      is_draft = true,
      post_date = null,
    } = req.body

    const { id: userId } = req.body.user

    const dataCharity: ICharity = {
      slug: slugify(title),
      author: userId,
      title,
      description,
      donation_target,
      start_date,
      end_date,
      is_draft,
      status,
      post_date,
    }

    const newCharity = await Charity.create(dataCharity)

    return res.status(200).json({
      status: 'success',
      content: newCharity,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc update charity
// @route patch /api/v1/charity/:id
// @access Private
export const updateCharity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params // ID of the charity to update
    const {
      title,
      description,
      donation_target,
      start_date,
      end_date,
      is_draft,
    } = req.body // Updated data

    const { id: userId } = req.body.user // Assuming user ID is retrieved from the JWT token

    // Find the charity by ID and check if the author matches the user ID
    const existingCharity = await Charity.findById(id)
    if (!existingCharity) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Charity not found' } })
    }

    // Check if the user making the request is the author of the charity
    if (existingCharity?.author?.toString() !== userId) {
      return res.status(403).json({
        error: {
          code: 403,
          message: 'You are not authorized to update this charity',
        },
      })
    }

    const dataCharity: ICharity = {
      slug: slugify(title),
      author: userId,
      title,
      description,
      donation_target,
      start_date,
      end_date,
      is_draft,
      post_date: existingCharity.post_date,
      status: existingCharity.status,
    }

    const updatedCharity = await Charity.updateOne(
      { _id: id },
      { $set: dataCharity }
    )
    if (updatedCharity.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to the charity' })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Charity updated successfully',
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc update charity
// @route patch /api/v1/charity/:id/status
// @access Private
export const acceptCharity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params // ID of the charity to update
    const { status } = req.body // Updated data

    // Find the charity by ID and check if the author matches the user ID
    const existingCharity = await Charity.findById(id)
    if (!existingCharity) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Charity not found' } })
    }

    let dataCharity: IAcceptCharityData = {
      status: status,
    }

    if (status === 'accept') {
      dataCharity = {
        ...dataCharity,
        post_date: Date.now(),
      }
    }

    await Charity.updateOne({ _id: id }, { $set: dataCharity })

    return res.status(200).json({
      status: 'success',
      message: 'Charity updated successfully',
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc delete charity
// @route delete /api/v1/charity/:id
// @access Private
export const deleteCharity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const charity = await Charity.findById(id)

    const { role } = req.body.user

    if (!charity) {
      return res.status(404).json({ error: 'Charity not found' })
    }

    // Check if the user making the request is the author of the charity
    if (role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'You are not authorized to delete this charity' })
    }

    await Charity.deleteOne({ _id: id })

    return res.status(200).json({
      status: 'success',
      message: 'Charity deleted successfully',
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
