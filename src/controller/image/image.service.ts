import { createReadStream, rename, rm } from 'fs'
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import sharp from 'sharp'
import { ImageEntity } from '../../entitys/image/image.entity'
import { ErrorDTO, HttpDTO } from 'src/types'
import { FgCyan, FgYellow, Reset } from '../../utils/color'
import {
  useAppDataSource,
  useMinioClient
} from '../../utils/database'
import { formatUrl } from '../../utils/formatUrl'
import { config } from 'dotenv'
import { randomUUID } from 'crypto'
import { PostImagesEntity } from '../../entitys/post/postImagesRelation.entity'

const { dataSource } = useAppDataSource()
const { minioClient, defaultBucket } = useMinioClient()

const imageRepository = dataSource.getRepository(ImageEntity)
const PostImageRelationRepository =
  dataSource.getRepository(PostImagesEntity)

// md5 : timer
let imageRelationTimer = new Map<string, NodeJS.Timeout>()
export function useImageRelationTimer() {
  return {
    upload(md5: string): string {
      if (!imageRelationTimer.has(md5)) {
        return 'file was expired'
      } else {
        clearTimeout(imageRelationTimer.get(md5))
        return 'upload success'
      }
    }
  }
}

export function uploadImage(
  file: any,
  uploader: string,
  quality: number // 1 - 100
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    console.log(uploader)
    saveImage(file, quality)
      .then(res => {
        resolve({
          status: StatusCodes.OK,
          data: res
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
      const _path = await saveImage(img.path, 100)

      if (_path === null) throw 'file path error'

      const url = await saveImage2db(_path as string, uploader)

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


/**
 * The function `saveImage` processes an image file, saves it to a storage service, generates a
 * presigned URL for access, and sets a timer for expiration.
 * @param {any} file - The `file` parameter in the `saveImage` function is the image file that you want
 * to save. It should contain information about the file, such as its path.
 * @param {number} quality - The `quality` parameter in the `saveImage` function represents the quality
 * of the image to be saved. It is a number that typically ranges from 0 to 100, where 0 is the lowest
 * quality and 100 is the highest quality. This parameter is used when converting and saving the
 * @returns The `saveImage` function returns a Promise that resolves with an object containing the
 * `eTag` and `preview` properties if the image saving process is successful. If there is an error
 * during the process, the Promise will be rejected with the error.
 */
function saveImage(file: any, quality: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(file.path)
    const fileBuffer: Array<Uint8Array> = []
    stream.on('data', (data: any) => {
      fileBuffer.push(data)
    })

    stream.on('end', async () => {
      const img = sharp(Buffer.concat(fileBuffer))
      const metadata = await img.metadata()
      const format = metadata.format ?? 'png'
      const objectName = `${randomUUID().replace(
        /\-/g,
        ''
      )}.${format}`

      const { data, info } = await img
        .toFormat(format, { quality })
        .toBuffer({ resolveWithObject: true })
      const putResult = await minioClient?.putObject(
        defaultBucket,
        objectName,
        data,
        info.size,
        metadata
      )
      if (putResult === null) {
        reject(putResult)
      } else {
        const url = await minioClient?.presignedGetObject(
          defaultBucket,
          objectName
        )
        rm(file.path, err => {
          if (err) {
            console.error(err)
          } else {
            console.log(`[cache removed] ${file.path}`)
          }
        })
        imageRelationTimer.set(
          putResult?.etag!,
          setTimeout(() => {
            minioClient
              ?.removeObject(defaultBucket, objectName)
              .then(() => {
                console.log(
                  `[${FgYellow}image${Reset}] ${objectName} was expired`
                )
              })
              .catch((err) => {
                console.error(err)
              })
          }, 1000 * 60 * 60)
        )
        resolve({
          eTag: putResult?.etag,
          preview: url
        })
      }
    })

    stream.on('error', err => {
      reject(err)
    })
  })
}

// save to database
function saveImage2db(
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
