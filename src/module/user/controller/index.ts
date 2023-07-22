import { Request, Response } from 'express'
import mongoose from 'mongoose'
import User from '../model/index.js'
import { genSaltSync, hashSync } from 'bcrypt-ts'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import { IApproval } from '../../approval/model/approval.interface.js'
import { SERVICE, api } from '../../../utils/api.js'
import { IUser } from '../model/userInterface.js'

// desc get me
// @route GET /api/v1/user/me
// @access Private
export const getMe = async (req: Request, res: Response) => {
  const { _id } = req.body.user //user data

  try {
    const user: IUser | null = await User.findById(_id).select(
      '-__v -password -refresh_token'
    )
    if (user === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Banner not found',
        },
      })
    }
    return res.status(200).json({
      user,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc update a user
// @route GET /api/v1/user/update/:id
// @access Private
export const updateUser = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const userId = req.params.id
    const { name, email, password, username } = req.body

    if (!name || !email || !password || !username) {
      return res.status(403).json({
        code: 403,
        message: 'name, email, password, username is required',
      })
    }
    // Check if the user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: 'User not found',
      })
    }

    // Check if the updated username or email already exists
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ username: username }, { email: email }] },
      ],
    })
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: 'User with username or email already exists',
      })
    }

    // Update the user information
    user.name = name
    user.email = email
    user.username = username

    if (password) {
      const hashPassword = await hashSync(password, genSaltSync(10))
      user.password = hashPassword
    }

    await user.save()
    // If you want to re-generate the access token and return it in the response,
    // you can do that here (similar to how it's done in the register method).

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      id: user._id,
      // If you want to include an access token in the response after updating,
      // you can add it here as well.
    })
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(err, res)
  }
}

// desc update a user
// @route GET /api/v1/user/update-status/:id
// @access Private
export const updateStatusUser = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const userId = req.params.id
    const { status } = req.body
    const { accessToken, role } = req.body.user //user data

    // Check if the user exists
    const user: any = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: 'User not found',
      })
    }

    // Check if the user making the request is the author of the banner
    if (user?._id?.toString() !== userId && role !== 'admin') {
      return res.status(403).json({
        error: {
          code: 403,
          message: 'You are not authorized to update this user',
        },
      })
    }

    const dataUser = {
      is_verified: status === 'accept',
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: dataUser },
      { new: true }
    )

    const dataApproval: IApproval = {
      approval_type: 'user',
      foreign_id: user._id,
      status,
    }

    await api.patch(
      `${SERVICE.Approval}/update-by-foreign-id/${user._id}`,
      dataApproval,
      {
        headers: {
          Authorization: `Bearer ${accessToken ? accessToken : ''}`,
        },
      }
    )

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      message: 'update status user successful',
      content: updatedUser,
    })
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(err, res)
  }
}
