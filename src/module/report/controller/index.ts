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
export const previewCampaignReport = async (req: Request, res: Response) => {
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
    const relativeUploadLocation = 'storage/report/campaign/preview'
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

    const cssFilePath = path.join(__dirname, 'templates', 'reportStyles.css')
    const styles = fs.readFileSync(cssFilePath, 'utf-8')

    const renderedHTML = await ejs.renderFile(
      path.join(__dirname, 'templates', 'report.ejs'),
      { campaign: campaign, paymentData: dataPayment, styles: styles }
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

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send('File not found.')
      }

      console.log(filePath)

      // Atur header respons agar browser memahami ini adalah konten PDF
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        'inline; filename=report-1691841871982.pdf'
      )

      // Gunakan streaming untuk mengirimkan konten PDF ke browser
      const fileStream = fs.createReadStream(filePath)
      fileStream.pipe(res)
    })

    // return res.render('report', {
    //   campaign: campaign,
    //   paymentData: dataPayment,
    //   styles: styles,
    // })
  } catch (error) {
    return errorHandler(error, res)
  }
}
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
    const relativeUploadLocation = 'storage/report/campaign'
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
    const cssFilePath = path.join(__dirname, 'templates', 'reportStyles.css')
    const styles = fs.readFileSync(cssFilePath, 'utf-8')

    const renderedHTML = await ejs.renderFile(
      path.join(__dirname, 'templates', 'report.ejs'),
      { campaign: campaign, paymentData: dataPayment, styles: styles }
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
      // displayHeaderFooter: true,
      // headerTemplate:
      //   "<div><div class='pageNumber'></div> <div>/</div><div class='totalPages'></div></div>",
      // footerTemplate:
      //   '<div style="text-align: right;width: 297mm;font-size: 8px;"><span style="margin-right: 1cm"><span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
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
