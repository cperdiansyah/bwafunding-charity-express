import mongoose, { Schema } from 'mongoose'
import { IBanner } from './banner.interface.js'

const bannerSchema: Schema<IBanner> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    // content: {
    //   type: String,
    //   required: [true, 'content is required'],
    // },
    status: {
      type: String,
      required: [true, 'status is required'],
      default: 'inactive',
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    end_date: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
    },
    redirection_link: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      // required: [true, 'author is required'],
      ref: 'User',
    },
  },
  { timestamps: true }
)

const Banner = mongoose.model<IBanner>('Banner', bannerSchema)

export default Banner
