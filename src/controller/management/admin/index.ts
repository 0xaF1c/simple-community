import { ControllerOptions } from "src/types"
import { create, login } from "./admin.service"
import { StatusCodes } from "http-status-codes"

export const adminController: ControllerOptions = {
  path: '/admin',
  handler: {
    '/login': {
      method: 'post',
      handlers: [
        (req: any, res) => {          
          if (req.auth === null) {
            res.json({
              status: StatusCodes.NOT_FOUND,
              error: {
                name: 'UserNotFound',
                message: 'unknown token'
              }
            })
            return
          }
          login(req.auth.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/create': {
      method: 'post',
      handlers: [
        (req: any, res) => {
          create(req.auth.id, req.auth.role)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                error: {
                  name: 'INTERNAL_SERVER_ERROR',
                  message: err.name
                }
              })
            })
        }
      ]
    }
  }
}