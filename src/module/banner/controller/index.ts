import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import Banner from '../model/index.js'
import { IBanner } from '../model/banner.interface.js'
import { IApproval } from '../../approval/model/approval.interface.js'
import { SERVICE, api } from '../../../utils/api.js'

// @desc Fetch all banners
// @route GET /api/v1/banner
// @access Public
export const getAllBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const rows = parseInt(req.query.rows as string) || 10

    const totalCount = await Banner.countDocuments({})
    const totalPages = Math.ceil(totalCount / rows)
    const currentDate = new Date()

    const banners: IBanner[] = await Banner.find({
      end_date: { $gte: currentDate },
    })
      .sort({ end_date: -1 })
      .skip((page - 1) * rows)
      .limit(rows)
      .populate({
        path: 'author',
        select: 'name',
      })
      .select('-__v')
      .exec()
    return res.status(200).json({
      banner: banners,
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

// @desc Fetch detail Banner
// @route GET /api/v1/banner/:id
// @access Public
export const getBannerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const banner: IBanner | null = await Banner.findById(req.params.id)
      .populate({
        path: 'author',
        select: 'name',
      })
      .select('-__v')
    if (banner === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Banner not found',
        },
      })
    }
    return res.status(200).json({
      banner,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc create charity
// @route POST /api/v1/charity/
// @access Private
export const crateBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    let {
      title,
      start_date,
      end_date,
      image,
      redirection_link,
      status = 'pending',
    } = req.body

    const { id: userId, accessToken, role } = req.body.user //user data

    if (role === 'admin') {
      status = 'accept'
    }

    // Create a new banner instance
    const dataBanner = {
      author: userId,
      title,
      status,
      start_date,
      end_date,
      image,
      redirection_link,
    }

    const newCharity = await Banner.create(dataBanner)

    const dataApproval: IApproval = {
      approval_type: 'banner',
      foreign_id: newCharity._id,
      status,
      refModel: 'Banner'
    }

    await api.post(`${SERVICE.Approval}/create`, dataApproval, {
      headers: {
        Authorization: `Bearer ${accessToken ? accessToken : ''}`,
      },
    })
    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      content: newCharity,
    })
  } catch (error) {
    console.log(error)
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// desc update charity
// @route patch /api/v1/banner/:id
// @access Private
export const updateBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the banner to update
    const { title, content, start_date, end_date, image, redirection_link } =
      req.body

    const { id: userId } = req.body.user // Assuming user ID is retrieved from the JWT token

    // Find the charity by ID and check if the author matches the user ID
    const existingBanner = await Banner.findById(id)
    if (!existingBanner) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Banner not found' } })
    }

    // Check if the user making the request is the author of the banner
    if (existingBanner?.author?.toString() !== userId) {
      return res.status(403).json({
        error: {
          code: 403,
          message: 'You are not authorized to update this banner',
        },
      })
    }

    const dataBanner = {
      author: userId,
      title,
      content,
      start_date,
      end_date,
      image,
      redirection_link,
    }

    const result = await Banner.updateOne({ _id: id }, { $set: dataBanner })
    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to the banner' })
    }

    // Retrieve the updated banner
    const updatedBanner = await Banner.findById(id)

    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({
      status: 'success',
      message: 'Banner updated successfully',
      content: updatedBanner,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}
// desc update charity
// @route patch /api/v1/banner/update-status/:id
// @access Private
export const updateStatusBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the charity to update
    const { status } = req.body // Updated data
    const { accessToken, role } = req.body.user //user data

    const { id: userId } = req.body.user // Assuming user ID is retrieved from the JWT token

    // Find the charity by ID and check if the author matches the user ID
    const existingBanner = await Banner.findById(id)
    if (!existingBanner) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Banner not found' } })
    }

    // Check if the user making the request is the author of the banner
    if (existingBanner?.author?.toString() !== userId && role !== 'admin') {
      return res.status(403).json({
        error: {
          code: 403,
          message: 'You are not authorized to update this banner',
        },
      })
    }

    const dataBanner = {
      status,
    }

    const result = await Banner.updateOne({ _id: id }, { $set: dataBanner })
    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to the banner' })
    }

    const dataApproval: IApproval = {
      approval_type: 'banner',
      foreign_id: existingBanner._id,
      status,
    }

    await api.patch(
      `${SERVICE.Approval}/update-by-foreign-id/${existingBanner._id}`,
      dataApproval,
      {
        headers: {
          Authorization: `Bearer ${accessToken ? accessToken : ''}`,
        },
      }
    )

    // Retrieve the updated banner
    const updatedBanner = await Banner.findById(id)

    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({
      status: 'success',
      message: 'Banner updated successfully',
      content: updatedBanner,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// desc delete charity
// @route delete /api/v1/charity/:id
// @access Private
export const deleteBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params

    const charity = await Banner.findById(id)

    const { role } = req.body.user

    if (!charity) {
      return res.status(404).json({ error: 'Banner not found' })
    }

    // Check if the user making the request is the author of the charity
    if (role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'You are not authorized to delete this banner' })
    }

    await Banner.deleteOne({ _id: id })
    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      message: 'Banner deleted successfully',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}
