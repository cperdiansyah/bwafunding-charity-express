import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import Banner from '../model/index.js'

// @desc Fetch all banners
// @route GET /api/v1/banner
// @access Public
export const getAllBanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({
      status: 'success',
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
    const {
      title,
      content,
      status,
      start_date,
      end_date,
      image,
      redirection_link,
    } = req.body

    const { id: userId } = req.body.user
    // Create a new banner instance
    const dataBanner = {
      author: userId,
      title,
      content,
      status,
      start_date,
      end_date,
      image,
      redirection_link,
    }

    const newCharity = await Banner.create(dataBanner)
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
    const {
      title,
      content,
      status,
      start_date,
      end_date,
      image,
      redirection_link,
    } = req.body

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
      status,
      start_date,
      end_date,
      image,
      redirection_link,
    }

    const result = await Banner.updateOne(
      { _id: id },
      { $set: dataBanner }
    )
    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to the charity' })
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