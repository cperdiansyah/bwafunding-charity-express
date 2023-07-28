import mongoose, { Types } from 'mongoose'
import { Request, Response } from 'express'
import { ICharity } from '../../charity/model/charityInterface.js'

// Data
import users from '../../../data/users.js'
import charities from '../../../data/charity.js'

// Model
import User from '../../user/model/index.js'
import Charity from '../../charity/model/index.js'
import banners from '../../../data/banner.js'
import { IBanner } from '../../banner/model/banner.interface.js'
import Banner from '../../banner/model/index.js'
import Approval from '../../approval/model/index.js'
import CharityFundHistory from '../../charity/model/fund_history.js'
import Transaction from '../../transaction/model/index.js'
import ApprovalUser from '../../approval/model/approval_user.js'
import dayjs from 'dayjs'

export const importData = async (req: Request, res: Response) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const exclude = req.query.exclude as Array<
      'banner' | 'charity' | 'sedekah-subuh'
    >

    await destroy()

    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    const mappedCharity = charities.map((charity: ICharity) => ({
      ...charity,
      author: new Types.ObjectId(adminUser),
    }))

    const mappedBanners = banners.map((banner: IBanner) => ({
      ...banner,
      author: new Types.ObjectId(adminUser),
    }))

    if (!exclude.includes('sedekah-subuh')) {
      /* Create Sedekah subuh campaign */
      const sedekahSubuh: ICharity = {
        author: new Types.ObjectId(adminUser),
        campaign_type: 'sedekah-subuh',
        slug: 'sedekah-subuh',
        title: 'Sedekah Subuh',
        status: 'accept',
        start_date: dayjs().toDate(),
        is_draft: false,
        description: '',
        post_date: dayjs().toDate(),
        end_date: null,
      }
      await Charity.create(sedekahSubuh)
    }

    if (!exclude.includes('banner')) {
      await Banner.insertMany(mappedBanners)
    }

    if (!exclude.includes('charity')) {
      await Charity.insertMany(mappedCharity)
    }
    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      status: 'success',
      message: 'Data imported successfully',
    })

    console.log('Data Imported...')
    // process.exit(0)
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    console.log('Error: ', error)
    res.status(400).json({
      status: 'fail',
      message: 'Import data failed',
    })
    // process.exit()
  }
}

export const destroyData = async (req: Request, res: Response) => {
  try {
    await destroy()
    res.status(200).json({
      status: 'success',
      message: 'Data Destroyed',
    })
    console.log('Data Destroyed...')
    // process.exit(0)
  } catch (error) {
    console.log('Error: ', error)
    res.status(400).json({
      status: 'fail',
      message: 'Destroy data failed',
    })
    // process.exit()
  }
}

const destroy = async () => {
  await User.deleteMany({})
  await Charity.deleteMany({})
  await Banner.deleteMany({})
  await Approval.deleteMany({})
  await ApprovalUser.deleteMany({})
  await CharityFundHistory.deleteMany({})
  await Transaction.deleteMany({})
}
