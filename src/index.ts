import express from "express"
import { startup } from "./utils/server"
import { userController } from "./controller/user"
import { expressjwt } from "express-jwt"
import { config } from 'dotenv'
import path from "path"
import { errorHandler, successHander } from "./middleware/consoleInfo"


config()

startup()
  .use(express.json())
  .use(
    expressjwt({
      secret: process.env.SECRET_KEY ?? 'unknown_secret_key',
      algorithms: ['HS256'],
      requestProperty: 'auth',
    })
    .unless({
      path: [
        '/favicon.ico',
        process.env.API_ROOT ?? '/api',
        new RegExp('/api/user/\S*'),
        new RegExp('/public/\S*')
      ]
    })
  )
  .use(errorHandler)
  .use('/public' as any, express.static(path.join(__dirname, './public')))
  .use(errorHandler)
  .use(successHander)
  .useController(userController)
  