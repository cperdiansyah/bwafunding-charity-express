import mongoose, { Schema } from 'mongoose'
import { IRewardHistory } from './reward.interface.js'

// Define poin schema
const rewardHisorySchema: Schema<IRewardHistory> = new mongoose.Schema(
  {
    id_reward: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'id_point is required'],
      ref: 'Reward',
    },
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'id_user is required'],
      ref: 'User',
    },
    timestamp: {
      type: Number,
      required: [true, 'timestamp is required'],
    },
  },
  { timestamps: true }
)
const RewardHistory = mongoose.model<IRewardHistory>(
  'Reward_History',
  rewardHisorySchema
)

export default RewardHistory
