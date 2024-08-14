import { ControllerOptions, ErrorDTO } from "src/types"
import multer from "multer"
import { existsSync, mkdir } from "fs"
import { StatusCodes } from "http-status-codes"
import { formatImage, getImage, uploadMultipleImage, uploadImage } from "./image.service"

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


/**
 * @deprecated this module is deprecated
 */
export const imageController: ControllerOptions = {
  path: '/image',
  handler: {
    '/upload': {
      method: 'post',
      middleware: upload.single('image'),
      handlers: [
        (req, res) => {
          
          if (req.file != undefined) {
            formatImage(req.file.path, req.file.filename)
              .then(url => {
                if (url === null) {
                  res.json({
                    status: StatusCodes.INTERNAL_SERVER_ERROR,
                    error: {
                      name: 'INTERNAL_SERVER_ERROR',
                      messsage: 'image format error'
                    }
                  })
                } else {
                  // @ts-ignore
                  uploadImage(url!, req.auth.id)
                    .then((response) => {
                      res.json(response)
                    })
                    .catch((response) => {
                      res.json(response)
                    })
                }
              })
          } else {
            res.json({
              status: StatusCodes.BAD_REQUEST,
              error: {
                name: 'BAD_REQUEST',
                messsage: 'not image in request body'
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
              .then((response) => {
                res.json(response)
              })
              .catch((response) => {
                res.json(response)
              })
          } else {
            res.json({
              status: StatusCodes.BAD_REQUEST,
              error: {
                name: 'BAD_REQUEST',
                messsage: 'not image in request body'
              }
            } as ErrorDTO)
          }
        }
      ]
    },
    '/i/:id': {
      method: 'get',
      handlers: [
        (req, res) => {
          getImage(req.params.id as string)
            .then((response) => res.redirect(response as string))
            .catch((response) => res.json(response))
        }
      ]
    }
  }
}