import { NextFunction, Request, Response } from 'express'

import { MidtransClient } from 'midtrans-node-client'
import crypto from 'crypto'

import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_SERVER_KEY,
} from '../../../utils/index.js'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import Transaction from '../model/index.js'

const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
})

// desc create charity payment
// @route GET /api/v1/payment/charity/list
// @access Private
export const getAllCharityPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { getAll, id_charities } = req.query
    const query: any = {}
    if (req.query.status) {
      query.status = req.query.status
    }
    if (id_charities) {
      query.id_charity = { $in: id_charities }
    }
    const totalCount = await Transaction.countDocuments(query)

    if (!getAll) {
      const page = parseInt(req.query.page as string) || 1
      const rows = parseInt(req.query.rows as string) || 10

      const totalPages = Math.ceil(totalCount / rows)

      const payment = await Transaction.find(query)
        .sort({ createdAt: 1 })
        .skip((page - 1) * rows)
        .limit(rows)
        // .populate('user_id')
        .populate('campaign_id', 'title slug') // Populate the 'campaign_id' field with 'name' attribute from the Charity model
        .populate('user_id', 'name email') // Populate the 'user_id' field with 'name' and 'email' attributes from the User model

        .select('-__v')
        .exec()

      // const total = payment.

      return res.status(200).json({
        campaignPayment: payment,
        meta: {
          page,
          rows,
          totalPages,
          total: totalCount,
        },
      })
    } else {
      const payment = await Transaction.find(query)
        .sort({ createdAt: 1 })

        // .populate('user_id')
        .populate('campaign_id', 'title slug') // Populate the 'campaign_id' field with 'name' attribute from the Charity model
        .populate('user_id', 'name email') // Populate the 'user_id' field with 'name' and 'email' attributes from the User model

        .select('-__v')
        .exec()

      return res.status(200).json({
        campaignPayment: payment,
        meta: {
          total: totalCount,
        },
      })
    }
  } catch (error) {
    return errorHandler(error, res)
  }
}
// desc get charity payment detail
// @route GET /api/v1/payment/charity/:id
// @access Private
export const getPaymentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payment = await Transaction.findById(req.params.id)
      // .populate('user_id')
      .populate('campaign_id', 'title slug') // Populate the 'campaign_id' field with 'name' attribute from the Charity model
      .populate('user_id', 'name email') // Populate the 'user_id' field with 'name' and 'email' attributes from the User model
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

// desc get Payment by id charity
// @route GET /api/v1/payment/charity/list
// @access Private
export const gePaymentByIdCharity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { getAll } = req.query

    const query: any = {
      id_charity: req.params.id,
    }
    if (req.query.status) {
      query.status = req.query.status
    }
    const totalCount = await Transaction.countDocuments(query)

    if (!getAll) {
      const page = parseInt(req.query.page as string) || 1
      const rows = parseInt(req.query.rows as string) || 10

      const totalPages = Math.ceil(totalCount / rows)
      // const currentDate = new Date()

      const payment = await Transaction.find(query)
        .sort({ createdAt: 1 })
        .skip((page - 1) * rows)
        .limit(rows)
        // .populate('user_id')
        .populate('campaign_id', 'title slug') // Populate the 'campaign_id' field with 'name' attribute from the Charity model
        .populate('user_id', 'name email') // Populate the 'user_id' field with 'name' and 'email' attributes from the User model

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
    } else {
      const payment = await Transaction.find(query)
        .sort({ createdAt: 1 })
        // .populate('user_id')
        .populate('campaign_id', 'title slug') // Populate the 'campaign_id' field with 'name' attribute from the Charity model
        .populate('user_id', 'name email') // Populate the 'user_id' field with 'name' and 'email' attributes from the User model

        .select('-__v')
        .exec()

      return res.status(200).json({
        campaignPayment: payment,
        meta: {
          total: totalCount,
        },
      })
    }
  } catch (error) {
    return errorHandler(error, res)
  }
}
// desc create Payment by id user
// @route GET /api/v1/payment/charity/list
// @access Private
export const getPaymentByIdUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { getAll } = req.query
    const query: any = {
      id_user: req.params.id,
    }
    if (req.query.status) {
      query.status = req.query.status
    }
    const totalCount = await Transaction.countDocuments(query)

    if (!getAll) {
      const page = parseInt(req.query.page as string) || 1
      const rows = parseInt(req.query.rows as string) || 10

      const totalPages = Math.ceil(totalCount / rows)
      // const currentDate = new Date()

      const payment = await Transaction.find(query)
        .sort({ createdAt: 1 })
        .skip((page - 1) * rows)
        .limit(rows)
        // .populate('user_id')
        .populate('campaign_id', 'title slug') // Populate the 'campaign_id' field with 'name' attribute from the Charity model
        .populate('user_id', 'name email') // Populate the 'user_id' field with 'name' and 'email' attributes from the User model

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
    } else {
      const payment = await Transaction.find(query)
        .sort({ createdAt: 1 })
        // .populate('user_id')
        .populate('campaign_id', 'title slug') // Populate the 'campaign_id' field with 'name' attribute from the Charity model
        .populate('user_id', 'name email') // Populate the 'user_id' field with 'name' and 'email' attributes from the User model

        .select('-__v')
        .exec()

      return res.status(200).json({
        campaignPayment: payment,
        meta: {
          total: totalCount,
        },
      })
    }
  } catch (error) {
    return errorHandler(error, res)
  }
}

