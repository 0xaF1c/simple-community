import express from "express"
import { expressjwt } from "express-jwt"
import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import path from "path"
import { startup } from "./utils/server"
import { userController } from "./controller/user"
import { errorHandler, successHander } from "./middleware/consoleInfo"
import { FgMagenta, FgYellow, Reset } from "./utils/color"
import { imageController } from "./controller/image"
import { deleteNoRelationImage, resetPath } from "./controller/image/image.service"
import { tweetController } from "./controller/tweet"
import { tagController } from "./controller/tags"
import { commentController } from "./controller/comment"

console.clear()

config()

startup()
  .use(express.json())
  .use(
    process.env.API_ROOT ?? '/api' as any,
    expressjwt({
      secret: process.env.SECRET_KEY ?? 'unknown_secret_key',
      algorithms: ['HS256'],
    })
    .unless({
      path: [
        process.env.API_ROOT ?? '/api',
        process.env.API_ROOT+'/' ?? '/api/',
        process.env.API_ROOT+'/user/profile',
        process.env.API_ROOT+'/user/tweets',
        process.env.API_ROOT+'/user/count',
        process.env.API_ROOT+'/tag/tweets',
        process.env.API_ROOT+'/tweet/recommend',
        process.env.API_ROOT+'/tag/recommend',
        process.env.API_ROOT+'/tweet/comments',
        process.env.API_ROOT+'/tag/detail',
        new RegExp('/image/i\S*'),
        new RegExp('/user/login\S*'),
        new RegExp('/user/register\S*'),
      ]
    })
  )
  .use(errorHandler)
  .use('/storage/uploads' as any, express.static(path.join(process.env.UPLOADS_PATH ?? '')))
  .use('/public' as any, express.static(path.join(__dirname, './public')))
  .use(errorHandler)
  .use(successHander)
  .useController(userController)
  .useController(imageController)
  .useController(tweetController)
  .useController(tagController)
  .useController(commentController)
  .onReady((app) => {    
    if (process.env.DEV_MODE === 'true') {
      console.log(`[${FgMagenta}DevMode${Reset}] Frontend Redirect: http://${process.env.DEV_HOST}:${process.env.DEV_PORT}`);
      app.get('/', (_, res) => {
        res.redirect(`http://${process.env.DEV_HOST}:${process.env.DEV_PORT}`)
      })
    } else {
      app.use('/' as any, express.static(path.join(__dirname, '../', process.env.FRONTEND_DIR ?? 'frontend/dist')))
    }
    // init()
    const token = jwt.sign({id: '1'}, process.env.SECRET_KEY ?? 'unknown_secret_key', { expiresIn: '60d' })

    console.log(`[${FgYellow}temp_token${Reset}] Bearer ${token}`)
    
    deleteNoRelationImage()
    setTimeout(() => {
      resetPath()
    }, 10 * 1000)
  })
