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
import { formatUrl } from '../../utils/formatUrl'
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
      return formatUrl(path.join(process.env.API_ROOT!, `/image/i/${key}`))
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

/**
 * The function `saveImage` takes an image file, uploader information, and quality setting, processes
 * and uploads the image to a storage service, and returns a key, preview URL, and object name.
 * @param {any} file - The `file` parameter in the `saveImage` function is the image file that you want
 * to save. It should contain information about the file such as its path, mimetype, and content.
 * @param {string} uploader - The `uploader` parameter in the `saveImage` function is a string that
 * represents the user or entity who is uploading the image. It is used to track who uploaded the image
 * and associate it with the image data in the storage system.
 * @param {number} quality - The `quality` parameter in the `saveImage` function represents the quality
 * of the image to be saved. It is a number that typically ranges from 0 to 100, where 0 is the lowest
 * quality and 100 is the highest quality. This parameter is used when converting and saving the
 * @returns The `saveImage` function returns a Promise that resolves with an object containing the
 * following properties:
 * - `key`: A randomly generated key for the saved image.
 * - `preview`: A presigned URL for accessing the saved image.
 * - `objectName`: The name of the saved image file in the storage.
 */
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
      const img = sharp(Buffer.concat(fileBuffer), {
        animated: true
      })
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

/**
 * The function `signImage` takes in parameters for an image's etag, filename, uploader, and key, saves
 * the image entity, and returns a promise resolving to the saved image entity or null.
 * @param {string} etag - An entity tag (etag) is a unique identifier for a specific version of a
 * resource. It is typically used for caching and versioning purposes in web applications.
 * @param {string} filename - The `filename` parameter in the `signImage` function refers to the name
 * of the image file that is being signed before saving it to the repository.
 * @param {string} uploader - The `uploader` parameter in the `signImage` function represents the user
 * or entity who is uploading the image. It is a string that specifies the name or identifier of the
 * uploader.
 * @param {string} key - The `key` parameter in the `signImage` function is typically used to represent
 * a unique identifier or access key that is associated with the image being signed. This key can be
 * used for various purposes such as authentication, authorization, or tracking the image within the
 * system. It helps in uniquely identifying the
 * @returns The `signImage` function is returning a Promise that resolves to either an `image` object
 * if the image was successfully saved, or `null` if there was an error during the saving process.
 */
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

/**
 * This TypeScript function retrieves an image URL using a key and returns it in a Promise, handling
 * errors appropriately.
 * @param {string} key - The `key` parameter is a string that is used to find an image in the image
 * repository based on its unique identifier.
 * @returns The `getImage` function returns a Promise that resolves with a string (URL of the image) if
 * the image is found and the presigned URL is successfully generated. If there is an error during the
 * process, it returns an ErrorDTO object containing the status code and error details.
 */
export function getImage(
  key: string
): Promise<string | ErrorDTO> {
  return new Promise((resolve, reject) => {
    console.log(key)
    
    imageRepository
      .findOne({
        where: { key }
      })
      .then(img => {
        minioClient
          ?.presignedGetObject(defaultBucket, img?.filename!)
          .then(url => {
            resolve(url.split('127.0.0.1:9000')[1])
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
