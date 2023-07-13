import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import _isEmpty from 'lodash/isEmpty.js'
dotenv.config()

/* Interface */
import { IPaymentCampaign } from '../model/paymentCampaign.interface.js'
/* Model */
import User from '../../../user/model/index.js'
import Charity from '../../../charity/model/index.js'
import PaymentCampaign from '../model/index.js'
/* Utils */
import { errorHandler } from '../../../../utils/helpers/errorHandler.js'
import { SERVICE, api } from '../../../../utils/api.js'

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
    const totalCount = await PaymentCampaign.countDocuments(query)

    if (!getAll) {
      const page = parseInt(req.query.page as string) || 1
      const rows = parseInt(req.query.rows as string) || 10

      const totalPages = Math.ceil(totalCount / rows)

      const payment = await PaymentCampaign.find(query)
        .sort({ createdAt: 1 })
        .skip((page - 1) * rows)
        .limit(rows)
        // .populate('id_user')
        .populate('id_charity', 'title slug') // Populate the 'id_charity' field with 'name' attribute from the Charity model
        .populate('id_user', 'name email') // Populate the 'id_user' field with 'name' and 'email' attributes from the User model

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
      const payment = await PaymentCampaign.find(query)
        .sort({ createdAt: 1 })

        // .populate('id_user')
        .populate('id_charity', 'title slug') // Populate the 'id_charity' field with 'name' attribute from the Charity model
        .populate('id_user', 'name email') // Populate the 'id_user' field with 'name' and 'email' attributes from the User model

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
    const totalCount = await PaymentCampaign.countDocuments(query)

    if (!getAll) {
      const page = parseInt(req.query.page as string) || 1
      const rows = parseInt(req.query.rows as string) || 10

      const totalPages = Math.ceil(totalCount / rows)
      // const currentDate = new Date()

      const payment = await PaymentCampaign.find(query)
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
    } else {
      const payment = await PaymentCampaign.find(query)
        .sort({ createdAt: 1 })
        // .populate('id_user')
        .populate('id_charity', 'title slug') // Populate the 'id_charity' field with 'name' attribute from the Charity model
        .populate('id_user', 'name email') // Populate the 'id_user' field with 'name' and 'email' attributes from the User model

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
    const totalCount = await PaymentCampaign.countDocuments(query)

    if (!getAll) {
      const page = parseInt(req.query.page as string) || 1
      const rows = parseInt(req.query.rows as string) || 10

      const totalPages = Math.ceil(totalCount / rows)
      // const currentDate = new Date()

      const payment = await PaymentCampaign.find(query)
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
    } else {
      const payment = await PaymentCampaign.find(query)
        .sort({ createdAt: 1 })
        // .populate('id_user')
        .populate('id_charity', 'title slug') // Populate the 'id_charity' field with 'name' attribute from the Charity model
        .populate('id_user', 'name email') // Populate the 'id_user' field with 'name' and 'email' attributes from the User model

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

      /* Create payment campaign */
    }
    const paymentCampaign = await PaymentCampaign.create(dataPayment)

    /* Create Midtrans Payment */
    const clientHost =
      process.env.NODE_ENV?.trim() === 'development'
        ? process.env.CORS_LOCAL
        : process.env.CORS_OPEN

    const resMidtrans = await api.post(
      `${SERVICE.PaymentGeneral}/process-transaction`,
      {
        transaction: {
          id: paymentCampaign._id,
          amount: paymentCampaign.amount,
        },
        user: {
          first_name: user.name.split(' ')[0],
          last_name: user.name.split(' ')[1],
          email: user.email,
        },
        items: [
          {
            id: charity._id,
            price: paymentCampaign.amount,
            quantity: 1,
            name: charity.title,
            url: `${clientHost}/campaign/${charity.slug}`,
          },
        ],
      }
    )
    const dataMidtransResponse = await resMidtrans.data.data
    await api.patch(
      `${SERVICE.PaymentCharity}/add-midtrans-response/${paymentCampaign._id}`,
      {
        response_midtrans: dataMidtransResponse,
        id_user,
      }
    )

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
  } catch (error: any) {
    // console.log(error)
    // console.log(error.message)
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// desc update charity payment
// @route POST /api/v1/payment/charity/update transactions
// @access Private
export const updateTransaction = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the charity to update
    const {
      id_user,
      id_charity,
      quantity = 1,
      amount,
      response_midtrans,
    } = req.body

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
      response_midtrans,
    }

    const updatedPaymentCampaign = await PaymentCampaign.updateOne(
      { _id: id },
      { $set: dataPayment }
    )
    if (updatedPaymentCampaign.modifiedCount === 0) {
      return res
        .status(200)
        .json({ message: 'No changes made to the payment campaign' })
    }
    // Retrieve the updated banner
    const updatedCampaign = await PaymentCampaign.findById(id)

    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({
      status: 'success',
      message: 'payment campaign updated successfully',
      content: updatedCampaign,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// desc update charity payment
// @route POST /api/v1/payment/charity/update transactions
// @access Private
export const updateMidtransResponse = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the charity to update
    const { id_user, response_midtrans } = req.body

    // const { id: userId } = req.body.user // Assuming user ID is retrieved from the JWT token

    // Find the charity by ID and check if the author matches the user ID
    const existingPaymentCampaign = await PaymentCampaign.findById(id)
    if (!existingPaymentCampaign) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Payment Campaign not found' } })
    }

    // Check if the user making the request is the author of the banner
    if (existingPaymentCampaign?.id_user?.toString() !== id_user) {
      return res.status(403).json({
        error: {
          code: 403,
          message: 'You are not authorized to update this campaign',
        },
      })
    }

    const dataPayment: IPaymentCampaign = {
      // id_user,
      response_midtrans,
    }
    console.log(response_midtrans)

    const updatedPaymentCampaign = await PaymentCampaign.updateOne(
      { _id: id },
      { $set: dataPayment }
    )
    if (updatedPaymentCampaign.modifiedCount === 0) {
      return res
        .status(200)
        .json({ message: 'No changes made to the payment campaign' })
    }
    // Retrieve the updated campaign
    const updatedCampaign = await PaymentCampaign.findById(id)

    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({
      status: 'success',
      message: 'payment campaign updated successfully',
      content: updatedCampaign,
    })
  } catch (error) {
    console.log(error)
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}

// desc update status payment
// @route POST /api/v1/payment/charity/update transactions
// @access Private
export const updateStatusTransaction = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { id } = req.params // ID of the charity to update
    const { id_user, status } = req.body

    const { id: userId } = req.body.user // Assuming user ID is retrieved from the JWT token

    // Find the charity by ID and check if the author matches the user ID
    const existingPaymentCampaign = await PaymentCampaign.findById(id)
    if (!existingPaymentCampaign) {
      return res
        .status(404)
        .json({ error: { code: 404, message: 'Payment Campaign not found' } })
    }

    // Check if the user making the request is the author of the banner
    if (existingPaymentCampaign?.id_user?.toString() !== userId) {
      return res.status(403).json({
        error: {
          code: 403,
          message: 'You are not authorized to update this campaign',
        },
      })
    }

    const dataPayment: IPaymentCampaign = {
      id_user,
      status,
    }

    const updatedPaymentCampaign = await PaymentCampaign.updateOne(
      { _id: id },
      { $set: dataPayment }
    )
    if (updatedPaymentCampaign.modifiedCount === 0) {
      return res
        .status(200)
        .json({ message: 'No changes made to the payment campaign' })
    }
    // Retrieve the updated campaign
    const updatedCampaign = await PaymentCampaign.findById(id)

    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({
      status: 'success',
      message: 'status campaign updated successfully',
      content: updatedCampaign,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}
