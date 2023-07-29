import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import dayjs from 'dayjs'

/* model */
import Poin from '../model/index.js'
import PoinHistory from '../model/poinHistory.js'

import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import { IPoin, IPoinHistory, historyType } from '../model/poin.interface.js'

// desc get point
// @route GET /api/v1/point/me
// @access Private
export const getPoinByUserId = async (req: Request, res: Response) => {
  try {
    const { _id: userId } = req.body.user //user data

    if (!userId) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Bad request',
        },
      })
    }
    const poin: IPoin | null = await Poin.findOne({ id_user: userId }).select(
      '-__v'
    )

    if (poin === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Poin User not found',
        },
      })
    }
    return res.status(200).json({
      poin,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc get point history
// @route GET /api/v1/point/history
// @access Private
export const getPoinHistoryList = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const rows = parseInt(req.query.rows as string) || 10

    /* Get Point Data */
    const { _id: userId } = req.body.user //user data
    if (!userId) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Bad request',
        },
      })
    }
    const poin: IPoin | null = await Poin.findOne({ id_user: userId })
    if (poin === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Poin User not found',
        },
      })
    }

    /* Get Point hisotry data */
    const filter: IPoinHistory = {
      id_point: poin._id,
    }
    const totalCount = await PoinHistory.countDocuments(filter)

    const pointHistory = await Poin.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'poin_histories', // Use the actual name of your PoinHistory collection
          localField: '_id',
          foreignField: 'id_point',
          as: 'poin_history',
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * rows },
      { $limit: rows },
    ])

    return res.status(200).json({
      data: pointHistory,
      meta: {
        page,
        rows,
        totalPages: Math.ceil(totalCount / rows),
        total: totalCount,
      },
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc create point
// @route POST /api/v1/point/create
// @access Private
export const createPoint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const {
      value = 0,
      userId,
    }: {
      userId: string
      value?: number
    } = req.body /* Body requst */

    if (!userId) {
      return res.status(400).json({
        code: 400,
        message: 'Userid  not found',
      })
    }

    const existingPoin: IPoin | null = await Poin.findOne({
      id_user: userId,
    })

    if (existingPoin) {
      return res.status(200).json({ message: 'Point has been created yet' })
    }

    const dataPoin: IPoin = {
      id_user: new mongoose.Types.ObjectId(userId),
      value,
    }
    await Poin.create(dataPoin)

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      message: 'Create Point successfully',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    console.log(error)
    return errorHandler(error, res)
  }
}

// desc update a user
// @route GET /api/v1/user/update/:id
// @access Private

export const updatePoin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    // const { id: userId } = req.body.user // Assuming user ID is retrieved from the JWT token
    const { id: userId } = req.params // Assuming user ID is retrieved from the JWT token
    const {
      value,
      type,
    }: {
      value: number
      type: historyType
    } = req.body // Updated data

    // Find the point by user ID
    const existingPoin: IPoin | null = await Poin.findOne({
      id_user: userId,
    })

    if (!existingPoin) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Point not found' } })
    }

    const dataPoin: IPoin = {
      id_user: existingPoin.id_user,
      updatedAt: dayjs().toDate(),
    }

    if (type === 'add') {
      dataPoin.value = (existingPoin?.value || 0) + value
    } else if (type === 'subtract') {
      dataPoin.value = (existingPoin?.value || 0) - value
    }

    /* Update poin wallet */
    await Poin.findByIdAndUpdate(
      { _id: existingPoin._id },
      { $set: dataPoin },
      { new: true }
    )

    /* Add poin wallet history */
    const dataPoinHisotry: IPoinHistory = {
      id_point: existingPoin?._id,
      history_type: type,
      timestamp: dayjs().unix(),
      value: value,
    }
    await PoinHistory.create(dataPoinHisotry)

    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({
      status: 'success',
      message: 'Poin updated successfully',
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// desc update a user
// @route GET /api/v1/user/update/:id
// @access Private
// export const updateUser = async (req: Request, res: Response) => {
//   const session = await mongoose.startSession()
//   session.startTransaction()

//   try {
//     const userId = req.params.id
//     const { name, email, password, username } = req.body

//     if (!name || !email || !password || !username) {
//       return res.status(403).json({
//         code: 403,
//         message: 'name, email, password, username is required',
//       })
//     }
//     // Check if the user exists
//     const user = await User.findById(userId)
//     if (!user) {
//       return res.status(404).json({
//         code: 404,
//         message: 'User not found',
//       })
//     }

//     // Check if the updated username or email already exists
//     const existingUser = await User.findOne({
//       $and: [
//         { _id: { $ne: userId } },
//         { $or: [{ username: username }, { email: email }] },
//       ],
//     })
//     if (existingUser) {
//       return res.status(400).json({
//         code: 400,
//         message: 'User with username or email already exists',
//       })
//     }

//     // Update the user information
//     user.name = name
//     user.email = email
//     user.username = username

//     if (password) {
//       const hashPassword = await hashSync(password, genSaltSync(10))
//       user.password = hashPassword
//     }

//     await user.save()
//     // If you want to re-generate the access token and return it in the response,
//     // you can do that here (similar to how it's done in the register method).

//     await session.commitTransaction()
//     session.endSession()

//     return res.status(200).json({
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       id: user._id,
//       // If you want to include an access token in the response after updating,
//       // you can add it here as well.
//     })
//   } catch (err) {
//     await session.abortTransaction()
//     session.endSession()
//     return errorHandler(err, res)
//   }
// }

// // desc update a user
// // @route GET /api/v1/user/update-status/:id
// // @access Private
// export const updateStatusUser = async (req: Request, res: Response) => {
//   const session = await mongoose.startSession()
//   session.startTransaction()

//   try {
//     const userId = req.params.id
//     const { status } = req.body
//     const { accessToken, role } = req.body.user //user data

//     // Check if the user exists
//     const user: any = await User.findById(userId)
//     if (!user) {
//       return res.status(404).json({
//         code: 404,
//         message: 'User not found',
//       })
//     }

//     // Check if the user making the request is the author of the banner
//     if (user?._id?.toString() !== userId && role !== 'admin') {
//       return res.status(403).json({
//         error: {
//           code: 403,
//           message: 'You are not authorized to update this user',
//         },
//       })
//     }

//     const dataUser = {
//       is_verified: status === 'accept',
//     }

//     const updatedUser = await User.findOneAndUpdate(
//       { _id: userId },
//       { $set: dataUser },
//       { new: true }
//     )

//     const dataApproval: IApproval = {
//       approval_type: 'user',
//       foreign_id: user._id,
//       status,
//     }

//     await api.patch(
//       `${SERVICE.Approval}/update-by-foreign-id/${user._id}`,
//       dataApproval,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken ? accessToken : ''}`,
//         },
//       }
//     )

//     await session.commitTransaction()
//     session.endSession()

//     return res.status(200).json({
//       status: 'success',
//       message: 'update status user successful',
//       content: updatedUser,
//     })
//   } catch (err) {
//     await session.abortTransaction()
//     session.endSession()
//     return errorHandler(err, res)
//   }
// }
