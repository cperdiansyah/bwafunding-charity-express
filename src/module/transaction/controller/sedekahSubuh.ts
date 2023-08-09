import { NextFunction, Request, Response } from 'express'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

import { MidtransClient } from 'midtrans-node-client'
import dotenv from 'dotenv'

dotenv.config()

import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_SERVER_KEY,
} from '../../../utils/index.js'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import Transaction from '../model/index.js'
import mongoose from 'mongoose'
import User from '../../user/model/index.js'
import Charity from '../../charity/model/index.js'
import { ITransaction } from '../model/transaction.interface.js'
import { SERVICE, api } from '../../../utils/api.js'
import { ICharityFundHistory } from '../../charity/model/charityInterface.js'

const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
})

// desc create charity payment
// @route GET /api/v1/transcation/list
// @access Private
export const getAllSedekahSubuhPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.body.user)
    const sedekahSubuh = await Charity.findOne({
      campaign_type: { $eq: 'sedekah-subuh' },
    })

    const {
      getAll,
      campaign_ids = sedekahSubuh?._id,
      transaction_type = 'sedekah-subuh',
    } = req.query

    const query: any = {}
    if (req.query.status) {
      query.status = req.query.status
    }
    if (campaign_ids) {
      query.campaign_id = { $eq: campaign_ids }
    }
    if (transaction_type) {
      query.transaction_type = { $eq: transaction_type }
    }

    let aggregateQuery = Transaction.aggregate()

    aggregateQuery.match(query)

    const totalCount = await Transaction.countDocuments(query)

    if (!getAll) {
      const page = parseInt(req.query.page as string) || 1
      const rows = parseInt(req.query.rows as string) || 10

      const totalPages = Math.ceil(totalCount / rows)

      aggregateQuery = aggregateQuery
        .sort({ createdAt: 1 })
        .skip((page - 1) * rows)
        .limit(rows)

      const payment = await aggregateQuery.exec()

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
      aggregateQuery = aggregateQuery.sort({ createdAt: 1 })

      const payment = await aggregateQuery.exec()

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

// desc create charity payment
// @route GET /api/v1/transcation/list
// @access Private
export const getSedekahSubuhPaymentByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id

    const user = await User.findOne({ _id: userId })
    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'User not found',
        },
      })
    }

    /* Get Sedekah Subuh Campaign */
    const sedekahSubuh = await Charity.findOne({
      campaign_type: { $eq: 'sedekah-subuh' },
    })

    const {
      getAll,
      distinct = false,
      campaign_ids = sedekahSubuh?._id,
      transaction_type = 'sedekah-subuh',
    } = req.query

    const query: any = {
      transaction_type: { $eq: transaction_type },
      campaign_id: { $eq: campaign_ids },
      user_id: { $in: [userId, new mongoose.Types.ObjectId(userId)] },
    }

    if (req.query.status) {
      if (req.query.status === 'settlement') {
        query.status = { $in: [req.query.status, 'capture'] }
      } else {
        query.status = req.query.status
      }
    }

    let aggregateQuery = Transaction.aggregate()
    let countQuery = Transaction.aggregate() // Duplicate the aggregation pipeline for counting

    aggregateQuery.match(query)
    countQuery.match(query) // Match stage for countQuery

    if (distinct) {
      // Your distinct filter
      const distinctStages: any = [
        {
          $addFields: {
            createdAtDate: {
              $dateFromParts: {
                year: {
                  $year: { date: '$createdAt', timezone: 'Asia/Jakarta' },
                },
                month: {
                  $month: { date: '$createdAt', timezone: 'Asia/Jakarta' },
                },
                day: {
                  $dayOfMonth: { date: '$createdAt', timezone: 'Asia/Jakarta' },
                },
              },
            },
          },
        },
        { $sort: { createdAtDate: 1 } },
        {
          $group: {
            _id: {
              createdAtDate: '$createdAtDate',
              user_id: '$user_id',
              campaign_id: '$campaign_id',
            },
            doc: { $first: '$$ROOT' },
          },
        },
        { $replaceRoot: { newRoot: '$doc' } },
      ]
      aggregateQuery.append(distinctStages)
      countQuery.append(distinctStages) // Apply the same distinct filter to countQuery
    }

    // Get the count
    let countResult = await countQuery
      .group({ _id: null, count: { $sum: 1 } })
      .exec()
    let totalCount = countResult.length > 0 ? countResult[0].count : 0

    if (!getAll) {
      const page = parseInt(req.query.page as string) || 1
      const rows = parseInt(req.query.rows as string) || 10

      const totalPages = Math.ceil(totalCount / rows)

      aggregateQuery = aggregateQuery
        .sort({ createdAt: 1 })
        .skip((page - 1) * rows)
        .limit(rows)

      const payment = await aggregateQuery.exec()

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
      aggregateQuery = aggregateQuery.sort({ createdAt: 1 })

      const payment = await aggregateQuery.exec()

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

export const checkSedekahSubuhPaymentByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    const userId = req.params.id
    const now = dayjs().hour(0).minute(0).second(0)
    // const now = dayjs().tz('Asia/Jakarta')
    const today = now.toDate()
    // console.log(today)

    const user = await User.findOne({ _id: userId })
    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'User not found',
        },
      })
    }

    /* Get Sedekah Subuh Campaign */
    const sedekahSubuh = await Charity.findOne({
      campaign_type: { $eq: 'sedekah-subuh' },
    })

    const query: any = {
      transaction_type: { $eq: 'sedekah-subuh' },
      campaign_id: { $eq: sedekahSubuh?._id },
      user_id: { $in: [userId, new mongoose.Types.ObjectId(userId)] },
      createdAt: {
        $gte: today,
        $lt: dayjs().add(1, 'd').toDate(),
      },
    }

    const TrxSedekahSubuh = await Transaction.find(query)
    const totalCount = await Transaction.countDocuments(query)
    return res.status(200).json({
      campaignPayment: TrxSedekahSubuh,
      meta: {
        total: totalCount,
      },
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

// desc charge transaction
// @route GET /api/v1/transcation/charge/sedekah-subuh
// @access Private
export const chargeTransactionSedekahSubuh = async (
  req: Request,
  res: Response
) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const {
      user_id,
      amount,
      quantity = 1,
      transaction_type = 'sedekah-subuh',
    } = req.body
    /* Check user and charity is exist */
    const user = await User.findOne({
      _id: user_id,
    })
    if (!user) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'User not found',
        },
      })
    }

    const sedekahSubuh = await Charity.findOne({
      campaign_type: { $eq: 'sedekah-subuh' },
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

    /* Create Midtrans Payment */
    const clientHost =
      process.env.NODE_ENV?.trim() === 'development'
        ? process.env.CORS_LOCAL
        : process.env.CORS_OPEN

    const dataPayment: ITransaction = {
      user_id,
      campaign_id: sedekahSubuh?._id,
      quantity,
      amount,
      status: 'pending',
      transaction_type,
    }

    /* Create payment campaign */
    const DataTransaction = await Transaction.create(dataPayment)
    const dataMidtransCharge = {
      transaction_details: {
        order_id: DataTransaction._id,
        gross_amount: DataTransaction.amount,
      },
      customer_details: {
        first_name: user.name.split(' ')[0],
        last_name: user.name.split(' ')[1] || '',
        email: user.email,
      },
      item_details: [
        {
          id: String(sedekahSubuh?._id),
          price: DataTransaction.amount,
          quantity: 1,
          name: sedekahSubuh?.title,
          url: `${clientHost}/campaign/${sedekahSubuh?.slug}`,
        },
      ],
    }
    const midtransCharge = await snap
      .createTransaction(dataMidtransCharge)
      .then((transaction) => {
        return transaction
      })

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      DataTransaction.id,
      { response_midtrans: midtransCharge },
      { new: true }
    )

    /* Create Charity Funding History */
    const dataCharityHistory: ICharityFundHistory = {
      campaign_id: sedekahSubuh?._id,
      transaction_id: DataTransaction._id,
      history_type: 'add',
    }
    await api.post(`${SERVICE.CharityHistory}/create`, dataCharityHistory, {
      headers: {
        Authorization: `${req?.headers.authorization}`,
      },
    })

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      message: 'Payment campaign created successfully',
      content: updatedTransaction,
    })
  } catch (error) {
    console.log(error)
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}
