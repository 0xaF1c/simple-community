import express from "express"
import { expressjwt } from "express-jwt"
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import path from "path"
import { startup } from "./utils/server"
import { userController } from "./controller/user"
import { errorHandler, successHander } from "./middleware/consoleInfo"
import { FgYellow, Reset } from "./utils/color"

console.clear()

config()

startup()
  .use(express.json())
  .use(
    expressjwt({
      secret: process.env.SECRET_KEY ?? 'unknown_secret_key',
      algorithms: ['HS256'],
    })
    .unless({
      path: [
        process.env.API_ROOT ?? '/api',
        '/favicon.ico',
        '/',
        '/public',
        '/api/user/register',
        '/api/user/verify',
        '/api/user/loginWithAccount',
        '/api/user/loginWithEmail',
        new RegExp('/public/\S*'),
        new RegExp('/frontend/dist/\S*')
      ]
    })
  )
  .use(errorHandler)
  .use('/public' as any, express.static(path.join(__dirname, './public')))
  .use('/' as any, express.static(path.join(__dirname, '../', process.env.FRONTEND_DIR ?? 'frontend/dist')))
  .use(errorHandler)
  .use(successHander)
  .useController(userController)
  .onReady(() => {
    // init()
    const token = jwt.sign({id: '1'}, process.env.SECRET_KEY ?? 'unknown_secret_key', { expiresIn: '60d' })

    console.log(`[${FgYellow}temp_token${Reset}] Bearer ${token}`)
  })