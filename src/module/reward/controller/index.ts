import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import axios from 'axios'
import fs from 'fs'

import path from 'path'
import { __dirname } from '../../../utils/index.js'
import multer from 'multer'

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

// @desc Fetch detail reward
// @route GET /api/v1/reward/:id
// @access Public
export const getRewardById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const banner: IReward | null = await Reward.findById(req.params.id)
    .select('-__v')
    if (banner === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Reward not found',
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

export const uploadRewardMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const relativeUploadLocation = 'storage/reward'
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
