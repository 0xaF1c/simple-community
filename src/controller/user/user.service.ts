import { ErrorDTO, HttpDTO } from "src/types"
import { UserDTO, UserEntity } from "../../entitys/user.entity"
import { useAppDataSource } from "../../utils/database"
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { RegisterParams } from "./validate"

const { dataSource } = useAppDataSource()

const userRepository = dataSource.getRepository(UserEntity)

export function createToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET ?? '14d')
}

export function register(user: RegisterParams): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    userRepository.count()
      .then(count => {
        if (!user.description) user.description = '这个用户很懒，什么也没留下'
        if (!user.account) user.account = `community_user_${count + 1}`
        if (!user.name) user.name = `community_user_${count + 1}`
        user.avatarUrl = '/public/avatar/default.jpg'
        user.backgroundUrl = '/public/background/avatar.jpg'

        userRepository.save(user)
          .then((saveResult) => {
            resolve({
              status: StatusCodes.OK,
              data: {
                message: 'Register Success',
                token: createToken({ id: saveResult.id })
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
      .catch(err => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: 'InternalServerError',
            message: err.message
          }
        })
      })
  })


  console.log(user)



  return {} as any
}

export function loginWithAccount(user: Record<string, any>): Promise<HttpDTO | ErrorDTO> {
  const IsEmail = user.account ? false : true
  const accountOption =
    (user.account && user.email) ?
      (IsEmail ? { email: user.email } : { account: user.account }) : {}

  return new Promise((resolve, reject) => {
    userRepository.findOne({
      where: Object.assign({}, {
        password: user.password ?? ''
      }, accountOption)
    })
      .then((findUser: UserEntity | null) => {
        if (findUser === null) {
          reject({
            status: StatusCodes.OK,
            error: {
              name: 'UserNotFound',
              message: `${IsEmail ? 'email' : 'account'} or password error`
            }
          })
        } else {
          resolve({
            status: StatusCodes.OK,
            data: {
              messsage: 'Login Success',
              token: createToken({ id: findUser.id })
            }
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

export function status(payload: Record<string, any>): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    userRepository.findOne({
      where: {
        id: payload.id
      }
    })
      .then((user) => {
        resolve({
          status: StatusCodes.OK,
          data: new UserDTO(user)
        })
      })
      .catch((err) => {
        console.error(err)

        reject({
          status: StatusCodes.UNAUTHORIZED,
          error: {
            name: 'UNAUTHORIZED',
            message: 'unkown token'
          }
        })
      })
  })
}