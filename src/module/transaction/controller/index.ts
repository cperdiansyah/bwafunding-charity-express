import { NextFunction, Request, Response } from 'express'

import { MidtransClient } from 'midtrans-node-client'
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()

import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_SERVER_KEY,
  MIDTRANS_BASE_URL,
} from '../../../utils/index.js'
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import Transaction from '../model/index.js'
import mongoose from 'mongoose'
import User from '../../user/model/index.js'
import Charity from '../../charity/model/index.js'
import { ITransaction } from '../model/transaction.interface.js'
import axios from 'axios'
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
export const getAllCharityPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { getAll, campaign_ids, transaction_type = 'campaign' } = req.query
    const query: any = {}
    if (req.query.status) {
      if (req.query.status === 'settlement') {
        query.status = { $in: [req.query.status, 'capture'] }
      } else {
        query.status = req.query.status
      }
    }
    if (campaign_ids) {
      query.campaign_id = { $in: campaign_ids }
    }
    if (transaction_type) {
      query.transaction_type = { $in: transaction_type }
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
// @route GET /api/v1/transcation/:id
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
// @route GET /api/v1/transcation/list
// @access Private
export const gePaymentByIdCharity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { getAll } = req.query

    const query: any = {
      campaign_id: req.params.id,
    }
    if (req.query.status) {
      if (req.query.status === 'settlement') {
        query.status = { $in: [req.query.status, 'capture'] }
      } else {
        query.status = req.query.status
      }
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
// desc get Payment by id user
// @route GET /api/v1/transcation/list
// @access Private
export const getPaymentByIdUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { getAll } = req.query
    const query: any = {
      user_id: req.params.id,
    }
    if (req.query.status) {
      query.status = req.query.status
      query.transaction_type = 'campaign'
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
// desc charge transaction
// @route GET /api/v1/transcation/charge
// @access Private
export const chargeTransaction = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const {
      user_id,
      campaign_id,
      quantity = 1,
      amount,
      transaction_type,
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
    const charity = await Charity.findOne({
      _id: campaign_id,
    })

    /* Check charity exist */
    if (!charity) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Charity not found',
        },
      })
    }

    /* Check total amount charity <= donation target */
    const transaction = await Transaction.find({
      campaign_id: campaign_id,
      status: 'settlement',
    })
      .sort({ createdAt: 1 })
      .select('-__v')
      .exec()

    const calculateAmount = calculateTotalAmount(transaction)

    if (calculateAmount > (charity?.donation_target || 0)) {
      return res.status(406).json({
        error: {
          code: 406,
          message: 'The donation has exceeded the target',
        },
      })
    }
    /* End check */

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
      campaign_id,
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
          id: String(charity._id),
          price: DataTransaction.amount,
          quantity: 1,
          name: charity.title,
          url: `${clientHost}/campaign/${charity.slug}`,
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
      campaign_id,
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

// desc callback notification push
// @route GET /api/v1/transcation/notifications-push
// @access Private

export const notificationPush = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const midtransSignature = req.body.signature_key as string
    const isValidSignature = verifyMidtransSignature(
      req.body,
      midtransSignature
    )
    if (!isValidSignature) {
      return res.status(403).json({ message: 'Invalid signature' })
    }

    // Extract the necessary information from the notification
    const { transaction_status, order_id, gross_amount } = req.body

    // Update the transaction status in the database
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: order_id },
      { $set: { status: transaction_status } },
      { new: true }
    )

    /* Updated charity fund history */
    const dataCharityFundingHistory = {
      campaign_id: new mongoose.Types.ObjectId(updatedTransaction?.campaign_id),
      status: transaction_status,
    }
    await api.patch(
      `${SERVICE.CharityHistory}/update/transaction/${order_id}`,
      dataCharityFundingHistory
    )

    const campaign = await Charity.findById(updatedTransaction?.campaign_id)

    /* Update point history */
    if (campaign?.campaign_type === 'sedekah-subuh') {
      /* Add point */
      const dataPoint = {
        value: gross_amount * 0.05,
        type: 'add',
      }
      if (transaction_status === 'deny') {
        dataPoint.type = 'subtract'
      }
      await api.patch(
        `${SERVICE.Point}/update/user/${updatedTransaction?.user_id}`,
        dataPoint
      )
    }

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      message: 'Transaction status updated successfully',
      data: updatedTransaction,
    })
  } catch (error) {
    console.log(error)
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// desc callback notification push
// @route GET /api/v1/transcation/notifications-push
// @access Private

export const checkStatus = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const transaction = req.params.id
    const { forceUdated } = req.query
    const buffer = Buffer.from(`${MIDTRANS_SERVER_KEY}:`)
    const AUTH = buffer.toString('base64')
    const config = {
      headers: {
        Accept: ' application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${AUTH}`,
      },
      withCredentials: true,
    }
    const resStatus = await axios.get(
      `${MIDTRANS_BASE_URL}/${transaction}/status`,
      config
    )
    const dataStatus = resStatus.data

    const midtransSignature = dataStatus.signature_key as string
    const isValidSignature = verifyMidtransSignature(
      dataStatus,
      midtransSignature
    )
    if (!isValidSignature) {
      return res.status(403).json({ message: 'Invalid signature' })
    }

    // // Extract the necessary information from the notification
    const { transaction_status, order_id } = dataStatus

    // Update the transaction status in the database
    if (forceUdated) {
      await Transaction.findOneAndUpdate(
        { _id: order_id },
        { $set: { status: transaction_status } },
        { new: true }
      )
    }

    const updatedTransaction = await Transaction.findById(order_id)

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: true,
      pesan: 'Berhasil cek status',
      data: updatedTransaction,
    })
  } catch (error) {
    console.log(error)
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

/* Helper Verify Midtrans Signature */
// Helper function to verify Midtrans signature
function verifyMidtransSignature(body: any, signature: string): boolean {
  // Replace with your actual Midtrans credentials
  const serverKey = MIDTRANS_SERVER_KEY

  // Concatenate timestamp and server key with the request body
  const concatenatedString = `${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`

  // Generate the signature using SHA512 and server key
  const generatedSignature = crypto
    .createHash('sha512')
    .update(concatenatedString)
    .digest('hex')

  // Compare the generated signature with the received signature
  return generatedSignature === signature
}

/* Helper For get Total Amount */
function calculateTotalAmount(campaignPayment: any) {
  let totalAmount = 0

  if (campaignPayment.length === 0) return totalAmount

  for (let i = 0; i < campaignPayment.length; i++) {
    const payment = campaignPayment[i]
    totalAmount += payment.amount
  }

  return totalAmount
}
