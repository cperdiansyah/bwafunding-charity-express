import mongoose from 'mongoose'

export interface ICharity {
  title: string
  slug: string
  description: string
  status: string
  is_draft: boolean
  donation_target: number
  start_date: Date
  end_date: Date | null
  post_date: Date | null
  author: mongoose.Schema.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  media: ICharityMedia[]
}

export interface ICharityMedia {
  content: string
  content_type: 'image' | 'video'
}
