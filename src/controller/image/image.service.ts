import { rename, rm } from 'fs'
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import sharp from 'sharp'
import { ImageEntity } from '../../entitys/image/image.entity'
import { ErrorDTO, HttpDTO } from 'src/types'
import { FgCyan, FgYellow, Reset } from '../../utils/color'
import {
  useAppDataSource
  // useMinioClient
} from '../../utils/database'
import { formatUrl } from '../../utils/formatUrl'
import { config } from 'dotenv'
import { randomUUID } from 'crypto'
import { PostImagesEntity } from '../../entitys/post/postImagesRelation.entity'

const { dataSource } = useAppDataSource()

const imageRepository = dataSource.getRepository(ImageEntity)
const PostImageRelationRepository =
  dataSource.getRepository(PostImagesEntity)

export function uploadImage(
  file: any,
  uploader: string,
  quality: number // 1 - 100
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    formatImage(file, uploader, quality)
      .then(() => {
        resolve({
          status: StatusCodes.OK,
          data: {}
        })
      })
      .catch(err => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: err.name,
            message: err.message
          }
        })
      })
  })
}
export function uploadMultipleImage(
  files: any[],
  uploader: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    const result: any = []
    files.forEach(async img => {
      const _path = await formatImage(
        img.path,
        img.filename,
        100
      )

      if (_path === null) throw 'file path error'

      const url = await saveImage(_path as string, uploader)

      result.push(url)
      if (result.length === files.length) {
        resolve({
          status: StatusCodes.OK,
          data: {
            urls: result
          }
        })
      } else {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: 'unknown error'
          }
        })
      }
    })
  })
}

async function formatImage(
  file: any,
  uploader: string,
  quality: number
): Promise<string | any> {
  const img = sharp(file.path)
  const metadata = await img.metadata()
  const format = metadata.format ?? 'png'
  const filename = `${file.filename}.${format}`

  img
    .toFormat(format, {
      quality: quality
    })
    .toFile(`${file.path}.${format}`, (err, info) => {
      if (err) {
        console.log(err)
        return err
      } else {
        console.log(uploader)
        console.log(file)
        console.log(info)
        console.log(filename)
        console.log(file.path)

        return ''
      }
    })
  setTimeout(() => {
    rm(file.path + '', err => {
      if (err) {
        console.log(err)
      } else {
        console.info(
          `[${FgYellow}delete cache${Reset}] ${file.path}`
        )
      }
    })
  }, 3000)
}

// save to database
function saveImage(
  _path: string,
  uploader: string
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const image = new ImageEntity()
    image.url = _path
    image.uploader = uploader

    imageRepository
      .save(image)
      .then(saveImage => {
        resolve(
          `${formatUrl(
            path.join(
              process.env.API_ROOT ?? '/api',
              '/image/i/'
            )
          )}${saveImage.id}`
        )
        // setTimeout(() => {
        //   deleteNoRelationImage()
        // }, 10 * 60 * 1000)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function getImage(
  id: string
): Promise<string | ErrorDTO> {
  return new Promise((resolve, reject) => {
    imageRepository
      .findOne({
        where: { id }
      })
      .then(img => {
        resolve(img?.url ?? '')
      })
      .catch(err => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: err.name,
            message: err.message
          }
        })
      })
  })
}

// declare
export function resetPath() {
  config()
  imageRepository
    .find({})
    .then(images => {
      images.forEach(img => {
        const oldPath = img.url
        const ext = path.extname(img.url)
        const oringinalPath = path.join(
          process.env.UPLOADS_PATH ?? '',
          '/image',
          path.basename(img.url)
        )
        const newBasename = randomUUID().replace(/\-/g, '') + ext
        const newPath = path.join(
          process.env.UPLOADS_PATH ?? '',
          '/image',
          newBasename
        )

        rename(oringinalPath, newPath, err => {
          if (err) throw err
          img.url = `/storage/uploads/image/${newBasename}`
          imageRepository
            .save(img)
            .then(newImg => {
              console.log(
                `[${FgCyan}ResetURL${Reset}] old: ${oldPath} new: ${newImg.url}`
              )
            })
            .catch(err => {
              throw err
            })
        })
      })
    })
    .catch(console.log)
}

export async function deleteNoRelationImage() {
  config()
  const whitelist: string[] = []
  ;(await PostImageRelationRepository.find({})).forEach(img => {
    const uuid = path.basename(img.url)

    whitelist.push(uuid)
  })
  ;(await imageRepository.find({})).forEach(img => {
    if (!whitelist.includes(img.id)) {
      const oringinalPath = path.join(
        process.env.UPLOADS_PATH ?? '',
        '/image',
        path.basename(img.url)
      )
      rm(oringinalPath, () => {
        imageRepository.remove(img)
        console.log(
          `[${FgCyan}已清除无引用图片${Reset}] ${oringinalPath}`
        )
      })
    }
  })
}
