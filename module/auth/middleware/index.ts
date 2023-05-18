import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload, VerifyOptions } from 'jsonwebtoken'
import { JWT_SECRET } from '../../../utils'
import User from '../../user/model'

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
      console.log(decoded)
      // req.body.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  } else {
    res.status(401).json({ error: 'No token provided' })
    return
  }
  if (!token) {
    res.status(401)
    throw new Error('You are not authenticated')
  }
}
