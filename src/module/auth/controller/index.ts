import { Request, Response } from 'express'
import { compare, genSaltSync, hashSync } from 'bcrypt-ts'
import jwt from 'jsonwebtoken'
// import asyncHandler from 'express-async-handler'
import User from '../../user/model/index.js'
import {
  JWT_COOKIE_EXPIRES_IN,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  JWT_COOKIE_EXPIRES_IN_MS,
} from '../../../utils/index.js'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  let user = await User.findOne({
    $or: [{ email }, { username: email }],
  })

  if (!user) {
    return res.status(404).json({
      error: {
        code: 404,
        massage: 'User not found',
      },
    })
  }
  const isMatch = await compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({
      error: {
        code: 404,
        massage: 'invalid credentials',
      },
    })
  }

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_verified: user.is_verified,
  }

  const accessToken = jwt.sign(userData, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || '20s',
  })
  const refreshToken = jwt.sign(userData, REFRESH_TOKEN_SECRET, {
    expiresIn: JWT_COOKIE_EXPIRES_IN || '7d',
  })

  return res
    .cookie('refreshToken', refreshToken, {
      expires: new Date(
        Date.now() +
          eval(JWT_COOKIE_EXPIRES_IN_MS || `${7 * 24 * 60 * 60}`) * 1000
      ),
      httpOnly: true,
    })
    .json({
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    })
}

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) return res.sendStatus(204)
  res.clearCookie('refreshToken')
  // return res.json(req.cookies)
  // return res.sendStatus(200).redirect('/')
  return res.status(200).json({
    status: 'success',
    message: 'user logged out',
  })
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, username } = req.body
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    })
    if (user) {
      return res.status(400).json({
        code: 400,
        massage: 'User with username or username already exists',
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

    const accessToken = jwt.sign(userData, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || '20s',
    })

    const refreshToken = jwt.sign(userData, REFRESH_TOKEN_SECRET, {
      expiresIn: JWT_COOKIE_EXPIRES_IN || '7d',
    })

    res.cookie('refreshToken', refreshToken, {
      expires: new Date(
        Date.now() +
          eval(JWT_COOKIE_EXPIRES_IN_MS || `${7 * 24 * 60 * 60}`) * 1000
      ),
      httpOnly: true,
    })

    return res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      accessToken,
    })
  } catch (err) {
    return errorHandler(err, res)
  }
}
