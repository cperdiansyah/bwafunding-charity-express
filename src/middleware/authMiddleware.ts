import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from '../utils/index.js'
import User from '../module/user/model/index.js'

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

      const decoded: any = jwt.verify(token, JWT_SECRET)
      req.body.user = await User.findById(decoded.id).select('-password')
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

export const adminAndUserVerifiedAccess = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userLogged = req.body.user
  if (userLogged && (userLogged.role === 'admin' || userLogged.is_verified)) {
    next()
  } else {
    return res.status(403).json({
      code: 403,
      error: 'Access Forbidden',
    })
  }
}

export const admindAccess = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userLogged = req.body.user
  if (userLogged && userLogged.role === 'admin') {
    next()
  } else {
    return res.status(403).json({
      code: 403,
      error: 'Access Forbidden',
    })
  }
}
