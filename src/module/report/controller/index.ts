import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import axios from 'axios'
import fs from 'fs'

import path from 'path'
import { __dirname } from '../../../utils/index.js'
import multer from 'multer'

import puppeteer from 'puppeteer'

/* Utils */
import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import { SERVICE, api } from '../../../utils/api.js'
import { ICharity } from '../../charity/model/charityInterface.js'
import Charity from '../../charity/model/index.js'

// desc get point
// @route GET /api/v1/report/campaign/:id
// @access Private
export const generateCampaignReport = async (req: Request, res: Response) => {
  try {
    const idCampaign = req.params.id
    if (idCampaign === null) {
      return res.status(400).json({
        error: {
          code: 400,
          message: 'Id Campaign requeired',
        },
      })
    }

    const campaign: ICharity | null = await Charity.findById(idCampaign)
      .populate({
        path: 'author',
        select: 'name',
      })
      .select('-__v')
    if (campaign === null) {
      return res.status(404).json({
        error: {
          code: 404,
          message: 'Charity not found',
        },
      })
    }
   

    const getPaymentData = await api.get(
      `${SERVICE.Transaction}/charity/${idCampaign}`,
      {
        params: {
          page: 1,
          rows: 1000,
          getAll: true,
          status: 'settlement',
        },
        headers: {
          ...req.headers
        }
      }
    )

    const dataPayment = getPaymentData.data

    const pdfUrl = ''
    return res.status(200).json({
      data: {
        campaign: campaign,
        paymentData: dataPayment,
      },
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
