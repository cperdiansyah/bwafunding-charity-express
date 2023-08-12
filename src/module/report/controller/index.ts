import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import ejs from 'ejs'

import path from 'path'
import { __dirname } from '../../../utils/index.js'

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

    /* Get Content Data */

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
          ...req.headers,
        },
      }
    )
    const dataPayment = getPaymentData.data

    /* Prepare uploaded document */
    const relativeUploadLocation = 'storage/report'
    const uploadFolder = path.resolve(__dirname, relativeUploadLocation)

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true })
    }

    /* Generate PDF Document*/

    // Create a browser instance
    const browser = await puppeteer.launch({
      headless: true,
    })

    // Create a new page
    const page = await browser.newPage()

    //Get HTML content from HTML file
    // const html = fs.readFileSync('index.html', 'utf-8')
    // console.log(html)

    // const htmlFilePath = path.join(__dirname, 'templates', 'report.html')
    // const contentHTML = fs.readFileSync(htmlFilePath, 'utf-8')
    const renderedHTML = await ejs.renderFile(
      path.join(__dirname, 'templates', 'report.ejs'),
      { campaign: campaign, paymentData: dataPayment }
    )

    await page.setContent(renderedHTML, { waitUntil: 'domcontentloaded' })

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen')

    // Downlaod the PDF
    const pdfBuffer = await page.pdf({
      // path: 'result.pdf',
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'A4',
    })

    const pdfName = `report-${Date.now()}.pdf`

    // Write the downloaded file to the uploads folder
    const filePath = `${relativeUploadLocation}/${pdfName}`

    fs.writeFileSync(filePath, pdfBuffer)

    const pdfUrl = `${req.protocol}://${req.get('host')}/${filePath}`
    // Close the browser instance
    await browser.close()

    return res.status(200).json({
      data: {
        campaign: campaign,
        paymentData: dataPayment,
      },
      url: pdfUrl,
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
