import { ControllerOptions, ErrorDTO } from 'src/types'
import multer from 'multer'
import { existsSync, mkdir } from 'fs'
import { StatusCodes } from 'http-status-codes'
import {
  getImage,
  uploadImage,
  uploadMultipleImage,
} from './image.service'


const upload = multer({
  dest: process.env.UPLOADS_PATH,
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const path = `${process.env.UPLOADS_PATH}/image`
      if (!existsSync(path)) {
        mkdir(path, () => {
          cb(null, `${path}`)
        })
      } else {
        cb(null, `${path}`)
      }
    }
  })
})

export const imageController: ControllerOptions = {
  path: '/image',
  handler: {
    '/upload': {
      method: 'post',
      middleware: upload.single('image'),
      handlers: [
        (req: any, res) => {
          if (req.file != undefined) {            
            uploadImage(req.file, req.auth.id, 100)
              .then((response) => {
                res.json(response)
              })
              .catch(response => {
                res.json(response)
              })
          } else {
            res.json({
              status: StatusCodes.BAD_REQUEST,
              error: {
                name: 'BAD_REQUEST',
                message: 'not image in request body'
              }
            } as ErrorDTO)
          }
        }
      ]
    },
    '/upload/multiple': {
      method: 'post',
      middleware: upload.array('images', 10),
      handlers: [
        (req, res) => {
          if (req.files) {
            // @ts-ignore
            uploadMultipleImage(req.files as any, req.auth.id)
              .then(response => {
                res.json(response)
              })
              .catch(response => {
                res.json(response)
              })
          } else {
            res.json({
              status: StatusCodes.BAD_REQUEST,
              error: {
                name: 'BAD_REQUEST',
                message: 'not image in request body'
              }
            } as ErrorDTO)
          }
        }
      ]
    },
    '/i/:key': {
      method: 'get',
      handlers: [
        (req, res) => {
          console.log(req.params.key)
          getImage(req.params.key as string)
            .then(response => res.redirect(response as string))
            .catch(response => res.json(response))
        }
      ]
    }
  }
}
