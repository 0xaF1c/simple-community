import { ErrorDTO, HttpDTO } from "src/types"
import { UserEntity } from "../../entitys/user.entity"
import { useAppDataSource } from "../../utils/database"
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

const { dataSource } = useAppDataSource()

const userRepository = dataSource.getRepository(UserEntity)

export function insert(user: UserEntity) {
  userRepository.save(user)
}

export function loginWithAccount(user: Record<string, any>): Promise<HttpDTO | ErrorDTO> {
  const IsEmail = user.account ? false : true
  const accountOption = 
    (user.account && user.email) ? 
    (IsEmail ? { email: user.email } : { account: user.account }) : {}
  
  return new Promise((resolve, reject) => {
    userRepository.findOne({
      where: Object.assign({},{
        password: user.password ?? ''
      }, accountOption)
    })
    .then((findUser: UserEntity | null) => {
      if (findUser === null) {
        reject({
          status: StatusCodes.OK,
          error: {
            name: 'UserNotFound',
            message: `${IsEmail?'email':'account'} or password error`
          }
        })
      } else {
        resolve({
          status: StatusCodes.OK,
          data: {
            messsage: 'Login Success',
            token: jwt.sign({
              id: findUser.id
            }, process.env.JWT_SECRET ?? '14d')
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

export function status(payload: Record<string, any>) {
  return new Promise((resolve, reject) => {
    
    userRepository.findOne({
      where: {
        id: payload.id
      }
    })
    .then((user) => {
      resolve(user)
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