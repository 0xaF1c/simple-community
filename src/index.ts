import { startup } from "./utils/startup"
import { userController } from "./controller/user"
import { expressjwt } from "express-jwt"
import { config } from 'dotenv'

config()

console.log()
startup()
  .useController(userController)
  .use(
    expressjwt({
      secret: process.env.SECRET_KEY ?? 'unknown_secret_key',
      algorithms: ['HS256']
    })
    .unless({
      path: [

      ]
    })
  )