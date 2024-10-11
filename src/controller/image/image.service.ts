import { createReadStream, rm } from 'fs'
import { StatusCodes } from 'http-status-codes'
// import path from 'path'
import sharp from 'sharp'
import { ImageEntity } from '../../entitys/image/image.entity'
import { ErrorDTO, HttpDTO } from 'src/types'
import { FgYellow, Reset } from '../../utils/color'
import {
  useAppDataSource,
  useMinioClient
} from '../../utils/database'
// import { formatUrl } from '../../utils/formatUrl'
import { config } from 'dotenv'
import { randomUUID } from 'crypto'
import path from 'path'
const { dataSource } = useAppDataSource()
const { minioClient, defaultBucket } = useMinioClient()

const imageRepository = dataSource.getRepository(ImageEntity)

interface ISignImageType {
  uploader: string
  filename: string
  etag: string
  timer: NodeJS.Timeout
}
// md5 : timer
let unSignImage = new Map<string, ISignImageType>()
export function useImageSigner() {
  config()
  const sign = (
    key: string
  ): 'file was expired' | 'file format error' | string => {
    console.log(`[${FgYellow}sign image${Reset}] ${key}`)

    if (!unSignImage.has(key)) {
      return 'file was expired'
    } else {
      const { filename, timer, uploader, etag } =
        unSignImage.get(key)!

      clearTimeout(timer)

      unSignImage.delete(etag)
      signImage(etag, filename, uploader, key)
        .then(console.log)
        .catch(console.log)
      return path.join(process.env.API_ROOT!, `/image/i/${key}`)
    }
    // return 'file format error'
  }
  return {
    sign
  }
}

export function uploadImage(
  file: any,
  uploader: string,
  quality: number // 1 - 100
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    saveImage(file, uploader, quality)
      .then(res => {
        resolve({
          status: StatusCodes.OK,
          data: {
            key: res.key,
            preview: res.preview
          }
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
    Promise.all(
      files.map(async img => {
        const saved = await saveImage(img, uploader, 100)

        return new Promise((resolve, reject) => {
          if (saved === null) {
            reject({
              key: null,
              preview: null
            })
          } else {
            resolve({
              key: saved.key,
              preview: saved.preview
            })
          }
        })
      })
    )
      .then(result => {
        resolve({
          status: StatusCodes.OK,
          data: result
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

function saveImage(
  file: any,
  uploader: string,
  quality: number
): Promise<any> {
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
        { 'Content-Type': file.mimetype }
      )

      const preview = await minioClient?.presignedGetObject(
        defaultBucket,
        objectName
      )
      if (putResult === null) {
        reject(putResult)
      } else {
        const key = randomUUID().replace(/\-/g, '')
        unSignImage.set(key, {
          filename: objectName,
          etag: putResult?.etag!,
          uploader: uploader,
          timer: setTimeout(() => {
            minioClient
              ?.removeObject(defaultBucket, objectName)
              .then(() => {
                console.log(
                  `[${FgYellow}image${Reset}] ${objectName} was expired`
                )
              })
              .catch(err => {
                console.error(err)
              })
          }, 1000 * 60 * 10)
        })

        resolve({
          key,
          preview,
          objectName
        })
      }
      rm(file.path, err => {
        if (err) {
          console.error(err)
        } else {
          console.log(`[cache removed] ${file.path}`)
        }
      })
    })

    stream.on('error', err => {
      reject(err)
    })
  })
}

// save to database
function signImage(
  etag: string,
  filename: string,
  uploader: string,
  key: string
): Promise<any | null> {
  return new Promise((resolve, reject) => {
    const image = new ImageEntity()
    image.etag = etag
    image.filename = filename
    image.uploader = uploader
    image.key = key

    imageRepository
      .save(image)
      .then(saveImage => {
        console.log(saveImage)
        resolve(image)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function getImage(
  key: string
): Promise<string | ErrorDTO> {
  return new Promise((resolve, reject) => {
    imageRepository
      .findOne({
        where: { key }
      })
      .then(img => {
        minioClient
          ?.presignedGetObject(defaultBucket, img?.filename!)
          .then(url => {
            resolve(url)
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
      .catch(err => {
        reject({
          status: StatusCodes.NOT_FOUND,
          error: {
            name: err.name,
            message: err.message
          }
        })
      })
  })
}

// declare
// export function resetPath() {
//   config()
//   imageRepository
//     .find({})
//     .then(images => {
//       images.forEach(img => {
//         const oldPath = img.url
//         const ext = path.extname(img.url)
//         const oringinalPath = path.join(
//           process.env.UPLOADS_PATH ?? '',
//           '/image',
//           path.basename(img.url)
//         )
//         const newBasename = randomUUID().replace(/\-/g, '') + ext
//         const newPath = path.join(
//           process.env.UPLOADS_PATH ?? '',
//           '/image',
//           newBasename
//         )

//         rename(oringinalPath, newPath, err => {
//           if (err) throw err
//           img.url = `/storage/uploads/image/${newBasename}`
//           imageRepository
//             .save(img)
//             .then(newImg => {
//               console.log(
//                 `[${FgCyan}ResetURL${Reset}] old: ${oldPath} new: ${newImg.url}`
//               )
//             })
//             .catch(err => {
//               throw err
//             })
//         })
//       })
//     })
//     .catch(console.log)
// }

// export async function deleteNoRelationImage() {
//   config()
//   const whitelist: string[] = []
//   ;(await PostImageRelationRepository.find({})).forEach(img => {
//     const uuid = path.basename(img.url)

//     whitelist.push(uuid)
//   })
//   ;(await imageRepository.find({})).forEach(img => {
//     if (!whitelist.includes(img.id)) {
//       const oringinalPath = path.join(
//         process.env.UPLOADS_PATH ?? '',
//         '/image',
//         path.basename(img.url)
//       )
//       rm(oringinalPath, () => {
//         imageRepository.remove(img)
//         console.log(
//           `[${FgCyan}已清除无引用图片${Reset}] ${oringinalPath}`
//         )
//       })
//     }
//   })
// }
