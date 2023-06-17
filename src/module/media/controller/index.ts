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
      if (error) {
        console.log(error)
        return errorHandler(error, res)
      } else {
        const fileUrls: string[] = (req.files as [])?.map(
          (file: Express.Multer.File) => {
            return `${req.protocol}://${req.get(
              'host'
            )}/${relativeUploadLocation}/${file.filename}`
          }
        )

        return res.status(200).json({
          status: 'success',
          message: 'Media upload successfully',
          url: fileUrls,
        })
      }
    })
  } catch (error) {
    return errorHandler(error, res)
  }
}
