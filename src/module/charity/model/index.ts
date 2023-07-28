import mongoose, { Schema } from 'mongoose'
import { ICharity, ICharityMedia } from './charityInterface.js'

const media: Schema<ICharityMedia> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  content_type: {
    type: String,
    required: true,
    default: 'image',
  },
})

const charitySchema: Schema<ICharity> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    slug: {
      type: String,
      required: [true, 'slug is required'],
      unique: true,
      validate: {
        validator: async function (slug: string) {
          const charity = await Charity.findOne({ slug })
          return !charity
        },
        message: 'slug already exists.',
      },
    },
    description: {
      type: String,
      // required: [true, 'description is required'],
      default: '',
    },
    status: {
      type: String,
      required: [true, 'status is required'],
      default: 'pending',
    },
    is_draft: {
      type: Boolean,
      default: false,
    },
    donation_target: {
      type: Number,
      // required: [true, 'donation target is required'],
      default: null,
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    end_date: {
      type: Date,
      default: null,
    },
    post_date: {
      type: Date,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      // required: [true, 'author is required'],
      ref: 'User',
    },
    media: {
      type: [media],
      default: null,
    },
    campaign_type: {
      type: String,
      required: [true, 'campaign_type is required'],
      default: 'campaign',
    },
  },
  { timestamps: true }
)

const Charity = mongoose.model<ICharity>('Charity', charitySchema)

export default Charity
