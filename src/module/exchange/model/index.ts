import mongoose, { Schema } from 'mongoose'
import { IExchange } from './exchange.interface.js'

// Define poin schema
const exchangeSchema: Schema<IExchange> = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'id_user is required'],
      ref: 'User',
    },
    reward_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'reward is required'],
      ref: 'Reward',
    },
    timestamp: {
      type: Number,
      required: [true, 'timestamp is required'],
    },
    status: {
      type: String,
      required: [true, 'status is required'],
    },
  },
  { timestamps: true }
)
const Exchange = mongoose.model<IExchange>('Exchange', exchangeSchema)

export default Exchange
