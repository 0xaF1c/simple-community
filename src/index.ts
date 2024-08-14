import express from "express"
import { expressjwt } from "express-jwt"
import { config } from 'dotenv'
import path from "path"
import { startup } from "./utils/server"
import { userController } from "./controller/user"
import { errorHandler, successHander } from "./middleware/consoleInfo"
import { FgMagenta, FgYellow, Reset } from "./utils/color"
// import { deleteNoRelationImage } from "./controller/image/image.service"
import { postController } from "./controller/post"
import { tagController } from "./controller/tags"
import { commentController } from "./controller/comment"
import { utilsController } from "./controller/utils"
import { adminController } from "./controller/management/admin"
import { userManagementController } from "./controller/management/user"
// import { deleteNoRelationPost } from "./controller/post/post.service"
import { createToken } from "./controller/user/user.service"
// import { deletNoRelationComment } from "./controller/comment/comment.service"

const unAuthPath = [
  process.env.API_ROOT ?? '/api',
  process.env.API_ROOT + '/' ?? '/api/',
  process.env.API_ROOT + '/user/profile',
  process.env.API_ROOT + '/user/posts',
  process.env.API_ROOT + '/user/count',
  process.env.API_ROOT + '/tag/posts',
  process.env.API_ROOT + '/post/recommend',
  process.env.API_ROOT + '/tag/recommend',
  process.env.API_ROOT + '/post/comments',
  process.env.API_ROOT + '/tag/detail',
  new RegExp('/utils/\S*'),
  new RegExp('/image/i\S*'),
  new RegExp('/user/login\S*'),
  new RegExp('/user/register\S*'),
]
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
        path: unAuthPath
      })
  )
  .use('/storage/uploads' as any, express.static(path.join(process.env.UPLOADS_PATH ?? '')))
  .use('/public' as any, express.static(path.join(__dirname, './public')))
  .use(errorHandler)
  .use(successHander)
  .useController(userController)
  .useController(postController)
  .useController(tagController)
  .useController(commentController)
  .useController(utilsController)
  .useController(adminController)
  .useController(userManagementController)
  .onReady((app) => {
    if (process.env.DEV_MODE === 'true') {
      console.log(`[${FgMagenta}DevMode${Reset}] Frontend Redirect: http://${process.env.DEV_HOST}:${process.env.DEV_PORT}`)
      app.get('/', (_, res) => {
        res.redirect(`http://${process.env.DEV_HOST}:${process.env.DEV_PORT}`)
      })
      const token = createToken({id: 1})

      console.log(`[${FgYellow}temp_token${Reset}] ${token}`)
    } else {
      app.use('/' as any, express.static(path.join(__dirname, '../', process.env.FRONTEND_DIR ?? 'frontend/dist')))
    }
    // init()
    setTimeout(() => {
      // 清除无根关联
      // deletNoRelationComment()
      // deleteNoRelationPost()
      // deleteNoRelationImage()
      // resetPath()
    }, 10 * 1000)
  })
