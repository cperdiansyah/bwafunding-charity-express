import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import axios from 'axios'
import fs from 'fs'

import Charity from '../model/index.js'
import {
  IAcceptCharityData,
  ICharity,
  RequestWithUserRole,
} from '../model/charityInterface.js'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import { slugify } from '../../../utils/helpers/index.js'
import path from 'path'
import { __dirname } from '../../../utils/index.js'
import multer from 'multer'
import { IApproval } from '../../approval/model/approval.interface.js'
import { SERVICE, api } from '../../../utils/api.js'

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
    const currentDate = new Date()

    const charities: ICharity[] = await Charity.find({
      end_date: { $gte: currentDate },
    })
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
      charity: charities,
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
// desc Get a single charities
// @route GET /api/v1/charity/slug/:id
// @access Public
export const getCharityBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const charity = await Charity.findOne({
      slug: req.params.id,
    })
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
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    let {
      title,
      description,
      donation_target,
      start_date,
      end_date,
      status = 'pending',
      is_draft = true,
      post_date = null,
      media,
    } = req.body

    const { id: userId, role, accessToken } = req.body.user

    if (role === 'admin') {
      status = 'accept'
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
      status,
      post_date,
      media,
    }

    const charity = await Charity.create(dataCharity)

    const dataApproval: IApproval = {
      approval_type: 'charity',
      foreign_id: charity._id,
      status,
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
      content: charity,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
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
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the charity to update
    const {
      title,
      description,
      donation_target,
      start_date,
      end_date,
      is_draft,
      media,
    } = req.body // Updated data

    const { id: userId, role: userRole } = req.body.user // Assuming user ID is retrieved from the JWT token
    // Find the charity by ID and check if the author matches the user ID
    const existingCharity = await Charity.findById(id)
    if (!existingCharity) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Charity not found' } })
    }

    // Check if the user making the request is the author of the charity
    if (
      existingCharity?.author?.toString() !== userId &&
      userRole !== 'admin'
    ) {
      return res.status(403).json({
        error: {
          code: 403,
          message: 'You are not authorized to update this charity',
        },
      })
    }

    const dataCharity: ICharity = {
      slug: slugify(title),
      title,
      description,
      donation_target,
      start_date,
      end_date,
      is_draft,
      post_date: existingCharity.post_date,
      status: existingCharity.status,
      media,
    }

    const updatedCharity = await Charity.updateOne(
      { _id: id },
      { $set: dataCharity }
    )
    if (updatedCharity.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to the charity' })
    }

    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({
      status: 'success',
      message: 'Charity updated successfully',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// desc update charity
// @route patch /api/v1/charity/:id/status
// @access Private
export const updateStatusCharity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the charity to update
    const { status } = req.body // Updated data
    const { accessToken } = req.body.user //user data

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

    const dataApproval: IApproval = {
      approval_type: 'charity',
      foreign_id: existingCharity._id,
      status,
    }

    await api.patch(
      `${SERVICE.Approval}/update-by-foreign-id/${existingCharity._id}`,
      dataApproval,
      {
        headers: {
          Authorization: `Bearer ${accessToken ? accessToken : ''}`,
        },
      }
    )

    await Charity.updateOne({ _id: id }, { $set: dataCharity })
    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      message: 'Charity updated successfully',
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
export const deleteCharity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
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
    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      message: 'Charity deleted successfully',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// const upload = multer({ dest: relativeUploadLocation })

export const uploadCharitymedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const relativeUploadLocation = 'storage/charity'
  const uploadFolder = path.resolve(__dirname, relativeUploadLocation)

  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true })
  }

  const upload = multer({ dest: relativeUploadLocation }).array('files')

  upload(req, res, async function (error) {
    try {
      const urls = req.body.urls
      // Array to store the uploaded file URLs
      const uploadedUrls: string[] = []

      for (const url of urls) {
        // Download the file from the provided URL
        const response = await axios.get(url, { responseType: 'arraybuffer' })
        const rawFilename = response.request.path.split('/')

        // Generate a unique filename for the uploaded file (optional)
        const filename = `${Date.now()}-${rawFilename[rawFilename.length - 1]}`

        // Write the downloaded file to the uploads folder
        const filePath = `${relativeUploadLocation}/${filename}`

        fs.writeFileSync(filePath, response.data)

        // Store the uploaded file's URL
        uploadedUrls.push(`${req.protocol}://${req.get('host')}/${filePath}`)
      }
      // Return the uploaded file URLs
      res.json({ uploadedUrls })
    } catch (error: any) {
      const status = error.response.status
      // console.error('Error uploading files:', error)

      if (status === 404) {
        return res.status(404).json({
          error: {
            code: 404,
            message: 'Image Url not found',
          },
        })
      }
      return res.status(500).json({ error: 'Failed to upload files' })
    }
  })
}
