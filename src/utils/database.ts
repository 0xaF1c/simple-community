import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from "typeorm"
import { FgYellow, Reset } from "./color"

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
    migrations: [],
  }
}

type IUseAppDataSourceCb = (dataSource: DataSource) => void
interface IUseAppDataSourceReturn {
  dataSource: DataSource
  init: (cb?: IUseAppDataSourceCb) => void
}

let dataSource: DataSource | undefined = undefined
export function useAppDataSource (callback?: IUseAppDataSourceCb) : IUseAppDataSourceReturn {
  const sqlServerStr = `${process.env.DB_USERNAME}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

  const init = (callback?: IUseAppDataSourceCb) => {
    dataSource = new DataSource(configFn())
    dataSource
      .initialize()
      .then((_dataSource) => {
        console.log(`[${FgYellow}db${Reset}] (${sqlServerStr}) connected!`)
        dataSource = _dataSource
        if (callback) {
          callback(_dataSource)
        }
      })
      .catch((err) => {
        console.info(`[${FgYellow}db${Reset}] (${sqlServerStr}) connect failed`)
        console.info(err)
      })
  }

  if (dataSource === undefined) {
    init(callback)
  }
  return {
    init,
    dataSource: dataSource ?? undefined as any,
  }
}