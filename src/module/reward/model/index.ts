import mongoose, { Schema } from 'mongoose'
import { IReward } from './reward.interface.js'

// Define poin schema
const rewardSchema: Schema<IReward> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    price: {
      type: Number,
      required: [true, 'value is required'],
      default: 0,
    },
  },
  { timestamps: true }
)
const Reward = mongoose.model<IReward>('Reward', rewardSchema)

export default Reward
