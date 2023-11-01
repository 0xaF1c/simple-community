import express from "express"
import { startup } from "./utils/server"
import { userController } from "./controller/user"
import { expressjwt } from "express-jwt"
import { config } from 'dotenv'
import { test } from "./middleware/test"
import path from "path"
config()

startup()
  .use(test)
  .use(express.json())
  .use(
    expressjwt({
      secret: process.env.SECRET_KEY ?? 'unknown_secret_key',
      algorithms: ['HS256'],
      requestProperty: 'auth'
    })
    .unless({
      path: [
        process.env.API_ROOT ?? '/api',
        new RegExp('/public/\S*')
      ]
    })
  )
  .use('/public' as any, express.static(path.join(__dirname, './public')))
  .useController(userController)
  