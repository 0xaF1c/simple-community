import { useAppDataSource } from "../../../utils/database"
import { UserEntity } from "../../../entitys/user/user.entity"
import { AdminEntity } from "../../../entitys/admin/admin.entity"
import { StatusCodes } from "http-status-codes"
import { createToken } from "../../../controller/user/user.service"

const { dataSource } = useAppDataSource()
const userRepository = dataSource.getRepository(UserEntity)
const adminEntityRepository = dataSource.getRepository(AdminEntity)
export function create(userId: number, role: string) {
  return new Promise((resolve, reject) => {
    if (role === 'super_admin') {
      userRepository.findOne({
        where: { id: userId }
      })
        .then((user) => {
          if (user === null) {
            reject({
              status: StatusCodes.NOT_FOUND,
              error: {
                name: 'UserNotFound',
                message: 'unkown token'
              }
            })
          }
          const admin = new AdminEntity({
            user_id: userId,
            role
          })
  
          adminEntityRepository.save(admin)
            .then((saveResult) => {
              resolve({
                status: StatusCodes.OK,
                data: {
                  message: 'Register Success',
                  token: createToken({ id: saveResult.id, role })
                }
              })
            })
            .catch((err) => {
              console.error(err)
              reject({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                error: {
                  name: 'InternalServerError',
                  message: err.message
                }
              })
            })
        })
        .catch((err) => {
          console.error(err)
          reject({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: {
              name: 'InternalServerError',
              message: err.message
            }
          })
        })
    } else {
      reject({
        status: StatusCodes.FORBIDDEN,
        error: {
          name: 'Forbidden Access',
          message: 'Operation recorded, Plz contact admin'
        }
      })
    }
  })
}

export function login(userId: number) {
  return new Promise((resolve, reject) => {
    adminEntityRepository.findOne({
      where: { user_id: userId }
    })
      .then((admin) => {
        if (admin === null) {
          reject({
            status: StatusCodes.NOT_FOUND,
            error: {
              name: 'UserNotFound',
              message: 'unkown token'
            }
          })
        } else {
          resolve({
            messsage: 'Admin Login Success',
            token: createToken({
              id: admin.user_id,
              role: admin.role
            })
          })
        }
      })
      .catch((err) => {
        console.error(err)
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: 'InternalServerError',
            message: err.message
          }
        })
      })
  })
}