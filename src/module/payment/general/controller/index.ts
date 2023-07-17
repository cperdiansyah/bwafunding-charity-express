import { Request, Response } from 'express'
import { MidtransClient } from 'midtrans-node-client'
import crypto from 'crypto'

import { errorHandler } from '../../../../utils/helpers/errorHandler.js'
import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_SERVER_KEY,
} from '../../../../utils/index.js'
import PaymentCampaign from '../../charity/model/index.js'

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
      data: responstTransaction,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}

export const midtransWebhook = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({
      message: 'Transaction status updated successfully',
      data: req?.body,
    })

  try {
    const midtransSignature = req.headers['x-midtrans-signature'] as string
    const isValidSignature = verifyMidtransSignature(
      req.body,
      midtransSignature
    )
    if (!isValidSignature) {
      return res.status(403).json({ message: 'Invalid signature' })
    }

    // Extract the necessary information from the notification
    const { transaction_id, status } = req.body

    // Update the transaction status in the database
    await PaymentCampaign.findOneAndUpdate(
      { transactionId: transaction_id },
      { $set: { status } },
      { new: true }
    )

    // Send a success response
    res.status(200).json({ message: 'Transaction status updated successfully' })
  } catch (error) {
    return errorHandler(error, res)
  }
}

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
