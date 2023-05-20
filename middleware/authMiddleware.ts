import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload, VerifyOptions } from 'jsonwebtoken'
import { JWT_SECRET } from '../utils'
import User from '../module/user/model'

interface CustomRequest extends Request {
  user?: JwtPayload
}

export const protect = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, JWT_SECRET)
      // req.body.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      return res.status(401).json({
        code: 401,
        error: 'unauthorized, token failed',
      })
    }
  } else {
    return res.status(401).json({ code: 401, error: 'No token included' })
  }
  if (!token) {
    return res.status(401).json({
      code: 401,
      error: 'You are not authenticated',
    })
  }
}
