import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'
import { FgYellow, Reset } from './color'
import { Client } from 'minio'

type IConfigFn = () => DataSourceOptions
config()
const configFn: IConfigFn = () => {
  config()
  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) ?? 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    // print result info to console
    logging: false,
    entities: [
      __dirname + '/../**/*.entity.{js,ts}',
      '../entitys/*.entity.{js,ts}'
    ],
    // https://stackoverflow.com/questions/58146915/how-to-use-subscribers-in-typeorm
    subscribers: [],
    migrations: []
  }
}

type IUseAppDataSourceCb = (dataSource: DataSource) => void
interface IUseAppDataSourceReturn {
  dataSource: DataSource
  init: (cb?: IUseAppDataSourceCb) => void
}

let dataSource: DataSource | undefined = undefined
export function useAppDataSource(
  callback?: IUseAppDataSourceCb
): IUseAppDataSourceReturn {
  const sqlServerStr = `${process.env.DB_USERNAME}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

  const init = (callback?: IUseAppDataSourceCb) => {
    dataSource = new DataSource(configFn())
    dataSource
      .initialize()
      .then(_dataSource => {
        console.log(
          `[${FgYellow}db${Reset}] (${sqlServerStr}) connected!`
        )
        dataSource = _dataSource
        if (callback) {
          callback(_dataSource)
        }
      })
      .catch(err => {
        console.info(
          `[${FgYellow}db${Reset}] (${sqlServerStr}) connect failed`
        )
        console.info(err)
      })
  }

  if (dataSource === undefined) {
    init(callback)
  }
  return {
    init,
    dataSource: dataSource ?? (undefined as any)
  }
}

interface IUseMinioClientReturn {
  minioClient: Client | null
  init: (cb?: IUseAppDataSourceCb) => void
  defaultBucket: string
}

let minioClient: Client | null = null
export function useMinioClient(): IUseMinioClientReturn {
  const init = () => {
    if (process.env.MINIO_HOST === undefined)
      throw Error('env property MINIO_HOST is undefined')
    if (process.env.MINIO_ACCESS_KEY === undefined)
      throw Error('env property MINIO_ACCESS_KEY is undefined')
    if (process.env.MINIO_SECRET_KEY === undefined)
      throw Error('env property MINIO_SECRET_KEY is undefined')
    if (process.env.MINIO_BUCKET === undefined)
      throw Error('env property MINIO_BUCKET is undefined')

    minioClient = new Client({
      endPoint: process.env.MINIO_HOST,
      port: 9000,
      useSSL: true,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY
    })

    console.log(
      `[${FgYellow}MiniO${Reset}] (${process.env.MINIO_HOST}) connected!`
    )
    minioClient
      .bucketExists(process.env.MINIO_BUCKET)
      .then(() => {
        console.log(
          `[${FgYellow}bucket${Reset}] (${process.env.MINIO_BUCKET}) alright exist!`
        )
      })
      .catch(err => {
        console.log(err)
      })
  }

  if (minioClient === null) {
    init()
  }

  return {
    init,
    minioClient,
    defaultBucket: process.env.MINIO_BUCKET!,
  }
}
