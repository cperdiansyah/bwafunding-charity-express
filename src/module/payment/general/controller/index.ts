import { Request, Response } from 'express'
import { MidtransClient } from 'midtrans-node-client'
import { errorHandler } from '../../../../utils/helpers/errorHandler.js'
import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_SERVER_KEY,
} from '../../../../utils/index.js'

export const processTransaction = async (req: Request, res: Response) => {
  try {
    const { transaction, user, items } = req.body
    const snap = new MidtransClient.Snap({
      isProduction: false,
      serverKey: MIDTRANS_SERVER_KEY,
      clientKey: MIDTRANS_CLIENT_KEY,
    })
    
    const orderParameter = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.amount,
      },
      customer_details: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      },
      item_details: items,
    }

    const responstTransaction = await snap
      .createTransaction(orderParameter)
      .then((transaction) => {
        return transaction
      })

    return res.status(200).json({
      status: 'success',
      message: 'Payment Created',
      // dataPayment,
      data: responstTransaction,
      // token,
      // redirection_url,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
