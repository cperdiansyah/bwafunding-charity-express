import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import _isEmpty from 'lodash/isEmpty.js'

import { errorHandler } from '../../../../utils/helpers/errorHandler.js'
/* Interface */
import { IPaymentCampaign } from '../model/paymentCampaign.interface.js'
/* Model */
import User from '../../../user/model/index.js'
import Charity from '../../../charity/model/index.js'
import PaymentCampaign from '../model/index.js'
import { SERVICE, api } from '../../../../utils/api.js'
import axios from 'axios'

// desc create charity payment
// @route GET /api/v1/payment/charity/list
// @access Private
export const getAllCharityPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const rows = parseInt(req.query.rows as string) || 10

    const totalCount = await Charity.countDocuments({})
    const totalPages = Math.ceil(totalCount / rows)
    // const currentDate = new Date()

    const payment = await PaymentCampaign.find({})
      .sort({ createdAt: 1 })
      .skip((page - 1) * rows)
      .limit(rows)
      // .populate('id_user')
      .populate('id_charity', 'title slug') // Populate the 'id_charity' field with 'name' attribute from the Charity model
      .populate('id_user', 'name email') // Populate the 'id_user' field with 'name' and 'email' attributes from the User model

      .select('-__v')
      .exec()

    return res.status(200).json({
      campaignPayment: payment,
      meta: {
        page,
        rows,
        totalPages,
        total: totalCount,
      },
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc create charity payment detail
// @route GET /api/v1/payment/charity/:id
// @access Private
export const getPaymentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payment = await PaymentCampaign.findById(req.params.id)
      // .populate('id_user')
      .populate('id_charity', 'title slug') // Populate the 'id_charity' field with 'name' attribute from the Charity model
      .populate('id_user', 'name email') // Populate the 'id_user' field with 'name' and 'email' attributes from the User model
      .select('-__v')
      .exec()
    if (payment === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Payment not found',
        },
      })
    }
    return res.status(200).json({
      payment: payment,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc create charity payment
// @route POST /api/v1/payment/charity/create transactions
// @access Private
export const createTransaction = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id_user, id_charity, quantity = 1, amount } = req.body
    const user = await User.findOne({
      _id: id_user,
    })
    const charity = await Charity.findOne({
      _id: id_charity,
    })

    /* Check amount is noit 0 or is number */
    if (amount === 0) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'amount must be greater than 0',
        },
      })
    } else if (typeof amount !== 'number') {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'amount must be in the form of a number',
        },
      })
    }

    /* Check user and charity is exist */
    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'User not found',
        },
      })
    }

    if (!charity) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Charity not found',
        },
      })
    }

    const dataPayment: IPaymentCampaign = {
      id_user,
      id_charity,
      quantity,
      amount,
      status: 'process',
    }
    const paymentCampaign = await PaymentCampaign.create(dataPayment)

    /* Get populated data */
    const getPayment = await api.get(
      `${SERVICE.PaymentCharity}/${paymentCampaign._id}`
    )
    const payment = getPayment.data

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      message: 'Payment campaign created successfully',
      content: { ...payment },
    })
  } catch (error) {
    console.log(error)
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}
