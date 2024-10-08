import { rename, rm } from 'fs'
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import sharp from 'sharp'
import { ImageEntity } from '../../entitys/image/image.entity'
import { ErrorDTO, HttpDTO } from 'src/types'
import { FgCyan, FgYellow, Reset } from '../../utils/color'
import { useAppDataSource, useMinioClient } from '../../utils/database'
import { formatUrl } from '../../utils/formatUrl'
import { config } from 'dotenv'
import { randomUUID } from 'crypto'
import { PostImagesEntity } from '../../entitys/post/postImagesRelation.entity'

const { dataSource } = useAppDataSource()
const { minioClient, defaultBucket } = useMinioClient()
const imageRepository = dataSource.getRepository(ImageEntity)
const PostImageRelationRepository =
  dataSource.getRepository(PostImagesEntity)
export async function formatImage(path: string, name: string) {
  let result: string | null = null
  try {
    const img = sharp(path)
    const metadata = await img.metadata()
    const format = metadata.format ?? 'png'
    const filename = `${name}.${format}`
    const url = `/storage/uploads/image/${filename}`
    result = url

    img
      .toFormat(format, {
        quality: 100
      })
      .toFile(`${path}.${format}`, (err, _info) => {
        if (err) {
          result = null
          return null
        } else {
          console.info(`[${FgYellow}uploaded${Reset}] ${url}`)
          return result
        }
      })
  } catch (err) {
    result = null
  }
  setTimeout(() => {
    rm(path, () => {
      console.info(`[${FgYellow}image${Reset}] cache clean`)
    })
  }, 1500)
  return result
}

export function uploadImage(
  path: string,
  uploader: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    saveImage(path, uploader)
      .then((url: any) => {
        resolve({
          status: StatusCodes.OK,
          data: { url }
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
    handleMultiple(files, uploader)
      .then(result =>
        resolve({
          status: StatusCodes.OK,
          data: {
            urls: result
          }
        })
      )
      .catch(err =>
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: err.name,
            message: err.message
          }
        })
      )
  })
}

function saveImage(
  _path: string,
  uploader: string
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const image = new ImageEntity()
    image.url = _path
    image.uploader = uploader

    minioClient?.fPutObject(defaultBucket, 'tttest1', './index.ts')
    // imageRepository.save(image)
    //   .then((saveImage) => {
    //     resolve(`${formatUrl(path.join(process.env.API_ROOT ?? '/api', '/image/i/'))}${saveImage.id}`)
    //     setTimeout(() => {
    //       deleteNoRelationImage()
    //     }, 10 * 60 * 1000)
    //   })
    //   .catch((err) => {
    //     reject(err)
    //   })
  })
}

function handleMultiple(files: any[], uploader: string) {
  return new Promise((resolve, _reject) => {
    const result: any = []
    files.forEach(async img => {
      const _path = await formatImage(img.path, img.filename)

      if (_path === null) throw 'unkown error'

      const url = await saveImage(_path as string, uploader)

      result.push(url)
      if (result.length === files.length) {
        resolve(result)
      }
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
