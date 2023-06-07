import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response } from 'express'

import User from '../module/user/model/index.js'
import { errorHandler } from '../utils/helpers/errorHandler.js'
import {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
} from '../utils/index.js'
import { ITokenPayload } from '../types/index.js'
import { isEmpty } from '../utils/helpers/index.js'

export const refreshToken = async (req: Request, res: Response) => {
  const {
    isAnonymous,
  }: {
    tokenType: 'anonymous' | 'private'
    isAnonymous: boolean
  } = req.body

  if (isEmpty(req.body)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: 'body is required "isAnonymous" parameter',
      },
    })
  }

  if (typeof isAnonymous !== 'boolean') {
    return res.status(400).json({
      error: {
        code: 400,
        message: '"isAnonymous" needs to be true or false value',
      },
    })
  }

  if (isAnonymous) {
    return refreshAnonymousToken(req, res)
  } else {
    try {
      const refreshToken = req.cookies.refreshToken
      if (!refreshToken) {
        return res.status(401).json({
          error: {
            code: 401,
            message: 'Unauthorized',
          },
        })
      }
      const user = await User.findOne({
        refresh_token: refreshToken,
      })

      if (!user) {
        return res.status(403).json({
          error: {
            code: 403,
            message: 'Forbidden access',
          },
        })
      }

      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as ITokenPayload

      const dataRefreshedToken: ITokenPayload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        isAuthenticated: true,
      }

      const accessToken = jwt.sign(dataRefreshedToken, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN || '20s',
      })
      return res.json({ accessToken })
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        res.clearCookie('refreshToken')
      }
      return errorHandler(error, res)
    }
  }
}

export const refreshAnonymousToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshAnonToken
    if (!refreshToken) {
      return res.status(401).json({
        error: {
          code: 401,
          message: 'Unauthorized',
        },
      })
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as ITokenPayload

    const dataRefreshedToken: ITokenPayload = {
      role: 'user',
      is_verified: false,
      isAuthenticated: true,
    }

    const accessToken = jwt.sign(dataRefreshedToken, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || '20s',
    })
    return res.json({ accessToken })
  } catch (error) {
    console.log(error)
    return errorHandler(error, res)
  }
}
