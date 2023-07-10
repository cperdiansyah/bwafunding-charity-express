import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { errorHandler } from '../../../../utils/helpers/errorHandler.js'
/* Interface */
import { IPaymentCampaign } from '../model/paymentCampaign.interface.js'
/* Model */
import User from '../../../user/model/index.js'
import Charity from '../../../charity/model/index.js'
import PaymentCampaign from '../model/index.js'

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

    if (amount) {
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
    }

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
    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
      status: 'success',
      message: 'Payment campaign created successfully',
      content: paymentCampaign,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    return errorHandler(error, res)
  }
}
