import mongoose, { Schema } from 'mongoose'
import { IConfig } from './config.interface.js'

// Define user schema
const configSchema: Schema<IConfig> = new mongoose.Schema(
  {
    sedekahSubuhEnable: {
      type: Boolean,
      required: [true, 'sedekahSubuhEnable is required'],
      default: false,
    },
    sedekahSubuhCanRepeat: {
      type: Boolean,
      required: [true, 'sedekahSubuhCanRepeat is required'],
      default: false,
    },
  },
  { timestamps: true }
)
const Config = mongoose.model<IConfig>('Config', configSchema)

export default Config
