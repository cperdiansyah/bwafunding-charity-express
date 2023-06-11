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
    res.clearCookie('refreshAnonToken')
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    })
    await session.commitTransaction()
    session.endSession()
    return res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    })
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
      return res.status(401).json({
        error: {
          code: 401,
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
        message: 'User with username or username already exists',
      })
    }
    const hashPassword = await hashSync(password, genSaltSync(10))
    const newUser = await User.create({
      name,
      email,
      username,
      password: hashPassword,
    })

    const userData = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      is_verified: newUser.is_verified,
    }

    const accessToken = jwt.sign(userData, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRED || '20s',
    })

    const refreshToken = jwt.sign(userData, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRED || '7d',
    })
    res.clearCookie('refreshAnonToken')
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    })
    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      accessToken,
    })
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(err, res)
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
  res.cookie('refreshAnonToken', refreshToken, {
    httpOnly: true,
  })

  return res.json({
    role: tokenData.role,
    accessToken,
  })
}

async function clearCookie(req: Request, res: Response) {
  res.clearCookie('refreshToken')
  res.clearCookie('refreshAnonToken')
}
