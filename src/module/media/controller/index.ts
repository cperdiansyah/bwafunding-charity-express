import multer, { FileFilterCallback, Multer } from 'multer'
import path from 'path'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'

import { errorHandler } from '../../../utils/helpers/errorHandler.js'
import { __dirname } from '../../../utils/index.js'

const relativeUploadLocation = 'storage/temp'
const uploadFolder = path.resolve(__dirname, relativeUploadLocation)

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadFolder)
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback) => {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(new Error('file type not allowed!'))
  }
}

export const postTempMedia = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true })
    }
    const upload = multer({
      storage: storage,
      fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }).array('media_source')

    upload(req, res, async function (error) {
      const { multiple } = req.body

      if (req.files?.length === 0 || req.files === undefined) {
        return errorHandler('media_sources is required', res)
      }

      if (
        (multiple === 'false' || multiple === false) &&
        Number(req?.files?.length || 0) > 1
      ) {
        return errorHandler('Send more than 1 file with multiple false', res)
      }

      if (error) {
        console.log(error)
        return errorHandler(error, res)
      } else {
        // console.log(req.body)

        let fileUrls: string[] | string = ''

        fileUrls = (req.files as [])?.map((file: Express.Multer.File) => {
          return `${req.protocol}://${req.get(
            'host'
          )}/${relativeUploadLocation}/${file.filename}`
        })

        if (
          ((multiple === 'false' || multiple === false) &&
            Number(req?.files?.length || 0) === 1) ||
          Number(req?.files?.length || 0) === 1
        ) {
          fileUrls = fileUrls.join('')
        }

        return res.status(200).json({
          status: 'success',
          message: 'Media sources upload successfully',
          url: fileUrls,
        })
      }
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
