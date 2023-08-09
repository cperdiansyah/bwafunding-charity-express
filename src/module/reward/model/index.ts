import mongoose, { Schema } from 'mongoose'
import { IReward } from './reward.interface.js'

// Define poin schema
const rewardSchema: Schema<IReward> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    image: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: [true, 'price is required'],
      default: 0,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)
const Reward = mongoose.model<IReward>('Reward', rewardSchema)

export default Reward
