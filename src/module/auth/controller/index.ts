import { Request, Response } from 'express'
import { compare, genSaltSync, hashSync } from 'bcrypt-ts'
import jwt from 'jsonwebtoken'
// import asyncHandler from 'express-async-handler'
import User from '../../user/model/index.js'
import {
  JWT_ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRED,
  JWT_REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED,
} from '../../../utils/index.js'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import { IAnonymousToken, ITokenPayload } from '../../../types/index.js'
import mongoose from 'mongoose'
import { cookiesOptions } from '../../../utils/helpers/index.js'
import { IApproval } from '../../approval/model/approval.interface.js'
import { SERVICE, api } from '../../../utils/api.js'

export const login = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { email, password, remember } = req.body
    let user = await User.findOne({
      $or: [{ email }, { username: email }],
    })

    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'User not found',
        },
      })
    }
    const isMatch = await compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({
        error: {
          code: 404,
          message: 'invalid credentials',
        },
      })
    }

    const userData: ITokenPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isAuthenticated: true,
      is_verified: user.is_verified,
    }

    const accessToken = jwt.sign(userData, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRED || '20s',
    })

    let refreshToken

    if (!remember) {
      refreshToken = jwt.sign(userData, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRED || '1d',
      })
    } else {
      refreshToken = jwt.sign(userData, JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
      })
    }

    await User.findOneAndUpdate(
      { _id: userData.id },
      {
        refresh_token: refreshToken,
      }
    )
    await clearCookie(req, res)
    res.cookie('refreshToken', refreshToken, cookiesOptions)
    await session.commitTransaction()
    session.endSession()
    return res
      .json({
        name: user.name,
        email: user.email,
        role: user.role,
        id: user._id,
        is_verified: user.is_verified,
        accessToken,
      })
      .end()
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

export const logout = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      await clearCookie(req, res)
      return res.status(403).json({
        error: {
          code: 403,
          message: 'Forbidden',
        },
      })
    }

    const user = await User.findOne({
      refresh_token: refreshToken,
    })

    if (!user) {
      await clearCookie(req, res)
      return res.status(406).json({
        error: {
          code: 406,
          message: 'User not logged in',
        },
      })
    }

    await User.findOneAndUpdate(
      { _id: user.id },
      {
        refresh_token: null,
      }
    )
    await clearCookie(req, res)
    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      message: 'user logged out',
    })
  } catch (error: any) {
    // console.log(error)
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

export const register = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { name, email, password, username } = req.body
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    })
    if (user) {
      return res.status(400).json({
        code: 400,
        message: 'User with username or email already exists',
      })
    }
    const hashPassword = await hashSync(password, genSaltSync(10))
    const newUser = await User.create({
      name,
      email,
      username,
      password: hashPassword,
    })

    /* Generate JWT */

    const userData = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      is_verified: newUser.is_verified,
      isAuthenticated: true,
    }

    const accessToken = jwt.sign(userData, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRED || '20s',
    })

    const refreshToken = jwt.sign(userData, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRED || '7d',
    })

    res.clearCookie('refreshAnonToken')
    res.cookie('refreshToken', refreshToken, cookiesOptions)

    /* Create Data Approval */
    const dataApproval: IApproval = {
      approval_type: 'user',
      foreign_id: newUser._id,
      refModel: 'User',
      status: 'pending',
    }

    await api.post(`${SERVICE.Approval}/create`, dataApproval, {
      headers: {
        Authorization: `Bearer ${accessToken ? accessToken : ''}`,
      },
    })

    /* Create wallet */
    await api.post(
      `${SERVICE.Point}/create`,
      {
        userId:  newUser._id
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken ? accessToken : ''}`,
        },
      }
    )

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      id: newUser._id,
      accessToken,
      is_verified: newUser.is_verified,
    })
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(err, res)
  }
}

export const checkAccount = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    let user = await User.findOne({
      $or: [{ email }, { username: email }],
    })
    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'User not found',
        },
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Username/Email valid',
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'User not found',
        },
      })
    }
    const hashPassword = await hashSync(newPassword, genSaltSync(10))
    await User.findByIdAndUpdate(
      user._id,
      { password: hashPassword },
      { new: true }
    )
    return res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

export const anonymousToken = async (req: Request, res: Response) => {
  const tokenData: IAnonymousToken = {
    role: 'user',
    isAuthenticated: false,
    is_verified: false,
  }

  const accessToken = jwt.sign(tokenData, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRED || '20s',
  })
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRED || '1d',
  })

  res.clearCookie('refreshToken')
  res.cookie('refreshAnonToken', refreshToken, cookiesOptions)

  return res.json({
    role: tokenData.role,
    accessToken,
  })
}

async function clearCookie(req: Request, res: Response) {
  res.clearCookie('refreshToken')
  res.clearCookie('refreshAnonToken')
}
