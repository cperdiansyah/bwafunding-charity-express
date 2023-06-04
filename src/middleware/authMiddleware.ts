import { Response, NextFunction } from 'express'
import { CustomRequest } from './middleware.interface.js'

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

export const adminAccess = async (
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
