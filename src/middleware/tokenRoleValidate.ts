import { RequestHandler } from "express"
import { StatusCodes } from "http-status-codes"
import { Role } from "src/entitys/admin/admin.entity"
import { ErrorDTO } from "src/types"

export function usePromissonGroup(group: Role[]): RequestHandler {

  return (req: any, res, next) => {
    if (group.includes(req.auth.role)) {
      next()
    } else {
      const errorRes: ErrorDTO = {
        status: StatusCodes.FORBIDDEN,
        error: {
          name: 'FORBIDDEN',
          messsage: 'You do not have promisson access',
        }
      }
      res.json(errorRes)
    }
  }
}