import { Request, Response } from 'express'
import mongoose from 'mongoose'
import _isEmpty from 'lodash/isEmpty.js'
import _isBoolean from 'lodash/isBoolean.js'
// import _isExist from 'lodash/isEx'

import Config from '../model/index.js'
import { IConfig } from '../model/config.interface.js'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'

// desc get me
// @route GET /api/v1/config
// @access Public
export const getConfig = async (req: Request, res: Response) => {
  try {
    const config = await Config.findOne({})

    return res.status(200).json({
      config,
    })
    // res.status(200)
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc get me
// @route GET /api/v1/config/update
// @access Private

export const updateConfig = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { sedekahSubuhEnable } = req.body

    if (sedekahSubuhEnable === undefined || !_isBoolean(sedekahSubuhEnable)) {
      return res.status(403).json({
        code: 403,
        message: 'sedekahSubuhEnable is required',
      })
    }

    const config = await Config.findOne({})

    const dataConfig: IConfig = {
      sedekahSubuhEnable,
    }

    // Update the config information
    const updatedConfig = await Config.findByIdAndUpdate(
      config?._id,
      dataConfig,
      { new: true }
    )

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      data: updatedConfig,
    })
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(err, res)
  }
}
