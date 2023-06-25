import mongoose, { Types } from 'mongoose'
import { Request } from 'express'

export interface ICharity {
  title: string
  slug: string
  description: string
  status: 'accept' | 'pending' | 'rejected' | 'completed'
  is_draft: boolean
  donation_target: number
  start_date: Date
  end_date: Date | null
  post_date: Date | null
  author?: Types.ObjectId | null
  media?: ICharityMedia[] | null
}

export interface ICharityMedia {
  content: string
  content_type: 'image' | 'video'
}

export interface RequestWithUserRole extends Request {
  user?: Record<string, any>
}

export interface IAcceptCharityData {
  status: 'accept' | 'pending' | 'rejected'
  post_date?: Date | number | null
}
