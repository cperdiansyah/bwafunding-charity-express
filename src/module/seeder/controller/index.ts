import { Types } from 'mongoose'
import { Request, Response } from 'express'
import { ICharity } from '../../charity/model/charityInterface.js'

// Data
import users from '../../../data/users.js'
import charities from '../../../data/charity.js'

// Model
import User from '../../user/model/index.js'
import Charity from '../../charity/model/index.js'

export const importData = async (req: Request, res: Response) => {
  try {
    await User.deleteMany({})
    await Charity.deleteMany({})

    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    const mappedCharity = charities.map((charity: ICharity) => ({
      ...charity,
      author: new Types.ObjectId(adminUser),
    }))

    await Charity.insertMany(mappedCharity)

    res.status(200).json({
      status: 'success',
      message: 'Data imported successfully',
    })

    console.log('Data Imported...')
    // process.exit(0)
  } catch (error) {
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
    await User.deleteMany({})
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
