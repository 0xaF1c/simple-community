import { ErrorDTO, HttpDTO } from 'src/types'
import {
  UserDTO,
  UserEntity
} from '../../entitys/user/user.entity'
import {
  useAppDataSource,
  useMinioClient
} from '../../utils/database'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import {
  FollowParams,
  GetLoginEmailCodeParams,
  LoginWithEmailCodeParams,
  RegisterParams,
  UpdatePasswordParams,
  UpdateProfileParams
} from './validate'
import { random } from 'lodash'
import { useMailer } from '../../utils/email'
import { UserFollowEntity } from '../../entitys/user/userFollowRelation.entity'
import { md5 } from '../../utils/md5'
import {
  deleteImage,
  useImageSigner
} from '../image/image.service'
import { ImageEntity } from '../../entitys/image/image.entity'
import { encode } from 'utf8mb3'

const { sendEmailVerifyCode } = useMailer()
const { dataSource } = useAppDataSource()

const userRepository = dataSource.getRepository(UserEntity)
const userFollowRepository =
  dataSource.getRepository(UserFollowEntity)
const imageRepository = dataSource.getRepository(ImageEntity)
const emailCodePool: Map<string, string> = new Map()
const { sign } = useImageSigner()
const { minioClient, defaultBucket } = useMinioClient()

function addItem(code: string, email: string) {
  if (emailCodePool.get(email) === undefined) {
    emailCodePool.set(email, code)
    setTimeout(() => {
      emailCodePool.delete(email)
    }, 60 * 1000)
    return true
  } else {
    return false
  }
}
function verify(code: string, email: string) {
  if (emailCodePool.get(email) === code) {
    emailCodePool.delete(email)
    return true
  }
  return false
}

export function createToken(
  payload: any,
  expiresIn?: string | number
) {
  return (
    'Bearer ' +
    jwt.sign(payload, process.env.SECRET_KEY!, {
      expiresIn: expiresIn ?? process.env.EXPIRES_IN
    })
  )
}

export function register(
  user: RegisterParams
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    if (verify(user.code, user.email)) {
      userRepository
        .count()
        .then(count => {
          if (!user.description)
            user.description = '这个用户很懒，什么也没留下'
          if (!user.account)
            user.account = `community_user_${count + 1}`
          if (!user.name)
            user.name = `community_user_${count + 1}`
          user.avatarUrl = '/public/avatar/default.jpg'
          user.backgroundUrl = '/public/background/default.jpg'
          user.password = md5(user.password)

          userRepository
            .save(user)
            .then(saveResult => {
              resolve({
                status: StatusCodes.OK,
                data: {
                  message: 'Register Success',
                  token: createToken({ id: saveResult.id })
                }
              })
            })
            .catch(err => {
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
    } else {
      reject({
        status: StatusCodes.OK,
        error: {
          message: 'verify code error'
        }
      })
    }
  })
}

export function loginWithAccount(
  user: Record<string, any>
): Promise<HttpDTO | ErrorDTO> {
  const IsEmail = user.account ? false : true
  const accountOption =
    user.account && user.email
      ? IsEmail
        ? { email: user.email }
        : { account: user.account }
      : {}

  return new Promise((resolve, reject) => {
    userRepository
      .findOne({
        where: Object.assign(
          {},
          {
            password: md5(user.password) ?? ''
          },
          accountOption
        )
      })
      .then((findUser: UserEntity | null) => {
        if (findUser === null) {
          reject({
            status: StatusCodes.OK,
            error: {
              name: 'UserNotFound',
              message: `${
                IsEmail ? 'email' : 'account'
              } or password error`
            }
          })
        } else {
          resolve({
            status: StatusCodes.OK,
            data: {
              message: 'Login Success',
              token: createToken({ id: findUser.id })
            }
          })
        }
      })
      .catch(err => {
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

export function status(
  payload: Record<string, any>
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    userRepository
      .findOne({
        where: {
          id: payload.id
        }
      })
      .then(user => {
        resolve({
          status: StatusCodes.OK,
          data: new UserDTO(user)
        })
      })
      .catch(err => {
        console.error(err)

        reject({
          status: StatusCodes.UNAUTHORIZED,
          error: {
            name: 'UNAUTHORIZED',
            message: 'unknown token'
          }
        })
      })
  })
}

export function profile(id: any): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    userRepository
      .findOne({
        where: { id }
      })
      .then(user => {
        if (user === null) {
          resolve({
            status: StatusCodes.NOT_FOUND,
            data: null
          })
        } else {
          resolve({
            status: StatusCodes.OK,
            data: new UserDTO(user)
          })
        }
      })
      .catch(err => {
        console.error(err)

        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: 'INTERNAL_SERVER_ERROR',
            message: 'unknown error'
          }
        })
      })
  })
}

export function sendEmailCode(
  params: GetLoginEmailCodeParams
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    const code = random(100000, 999999, false).toString()
    if (addItem(code, params.email)) {
      if (sendEmailVerifyCode(code, params.email)) {
        resolve({
          status: StatusCodes.OK,
          data: 'success'
        })
      } else {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: 'INTERNAL_SERVER_ERROR',
            message: 'unknown error'
          }
        })
      }
      console.log(code)
    } else {
      reject({
        status: StatusCodes.TOO_MANY_REQUESTS,
        error: {
          name: 'TOO_MANY_REQUESTS',
          message: 'code was sent to your email'
        }
      })
    }
    resolve({
      status: StatusCodes.OK,
      data: 'success'
    })
  })
}

export function loginWithEmailCode(
  params: LoginWithEmailCodeParams
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    if (verify(params.code, params.email)) {
      userRepository
        .findOne({ where: { email: params.email } })
        .then(user => {
          if (user === null) {
            reject({
              status: StatusCodes.NOT_FOUND,
              data: null
            })
          } else {
            resolve({
              status: StatusCodes.OK,
              data: {
                token: createToken({ id: user?.id })
              }
            })
          }
        })
        .catch(err => {
          console.error(err)

          reject({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: {
              name: 'INTERNAL_SERVER_ERROR',
              message: 'unknown error'
            }
          })
        })
    } else {
      reject({
        status: StatusCodes.OK,
        error: {
          name: 'VERIFY_CODE_ERROR',
          message: 'verify code error'
        }
      })
    }
  })
}
export function updateProfile(
  profile: UpdateProfileParams,
  id: number
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    const updateObj: Record<string, any> = {}
    if (profile.name) updateObj.name = profile.name
    if (profile.account) updateObj.account = profile.account
    if (profile.email) updateObj.email = profile.email
    if (profile.description)
      updateObj.description = encode(profile.description)

    const internalUpdateUser = () => {
      userRepository
        .update(
          {
            id
          },
          updateObj
        )
        .then(result => {
          resolve({
            status: StatusCodes.OK,
            data: result
          })
        })
        .catch(err => {
          reject({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: {
              name: err.name,
              message: err.message
            }
          })
        })
    }
    console.log(profile.backgroundUrl)
    if (profile.avatarUrl || profile.backgroundUrl) {
      userRepository
        .findOne({ where: { id } })
        .then(user => {
          if (user === null) {
            return
          }
          if (profile.avatarUrl) {
            updateObj.avatarUrl = sign(profile.avatarUrl)
            const key = user.avatarUrl.split('/image/i/')[1]
            deleteImage(key)
          }
          if (profile.backgroundUrl) {
            updateObj.backgroundUrl = sign(profile.backgroundUrl)
            const key = user.backgroundUrl.split('/image/i/')[1]
            deleteImage(key)
          }
          internalUpdateUser()
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      internalUpdateUser()
    }
  })
}
export function updatePassword(
  option: UpdatePasswordParams,
  id: number
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    const { oldPassword, newPassword } = option
    userRepository
      .findOne({
        where: { id }
      })
      .then(user => {
        if (user === null) {
          reject({
            status: StatusCodes.NOT_FOUND,
            error: {
              name: 'UserNotFound',
              message: 'unknown token'
            }
          })
        }
        if (user?.password === md5(oldPassword)) {
          userRepository
            .update(
              {
                id: user.id
              },
              {
                password: md5(newPassword)
              }
            )
            .then(result => {
              resolve({
                status: StatusCodes.OK,
                data: result
              })
            })
            .catch(err => {
              reject({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                error: {
                  name: err.name,
                  message: err.message
                }
              })
            })
        } else {
          reject({
            status: StatusCodes.OK,
            data: {
              msg: 'old password is not correct'
            }
          })
        }
      })
      .catch(() => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: 'InternalServerError',
            message: 'Internal Server Error'
          }
        })
      })
  })
}

export function follow(
  option: FollowParams,
  followingId: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    if (option.userId.toString() === followingId.toString()) {
      reject({
        status: StatusCodes.OK,
        data: {
          msg: 'you can not follow yourself'
        }
      })
    }
    if (option.follow === undefined) {
      option.follow = 'true'
    }

    if (option.follow === 'true') {
      userFollowRepository
        .findOne({
          where: {
            userId: option.userId,
            followingId: followingId
          }
        })
        .then(res => {
          if (res) {
            console.log('plz not repeat follow')
            reject({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              data: {
                msg: 'plz not repeat follow'
              }
            })
          } else {
            userFollowRepository
              .save({
                userId: option.userId,
                followingId: followingId
              })
              .then(() => {
                resolve({
                  status: StatusCodes.OK,
                  data: {
                    msg: 'follow success'
                  }
                })
              })
              .catch(err => {
                reject({
                  status: StatusCodes.INTERNAL_SERVER_ERROR,
                  error: {
                    name: err.name,
                    message: err.message
                  }
                })
              })
          }
        })
        .catch(err => {
          reject({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: {
              name: err.name,
              message: err.message
            }
          })
        })
    } else {
      userFollowRepository
        .delete({
          userId: option.userId,
          followingId: followingId
        })
        .then(() => {
          resolve({
            status: StatusCodes.OK,
            data: {
              msg: 'unFollow success'
            }
          })
        })
        .catch(err => {
          reject({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: {
              name: err.name,
              message: err.message
            }
          })
        })
    }
  })
}

export function getFollowing(
  userId: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    userFollowRepository
      .createQueryBuilder()
      .leftJoinAndSelect(
        UserEntity,
        'user',
        'user.id = UserFollowEntity.followingId'
      )
      .select()
      .where('UserFollowEntity.userId = :id', { id: userId })
      .getRawMany()
      .then(res => {
        console.log(res)

        resolve({
          status: StatusCodes.OK,
          data: UserDTO.fromFindResult(res)
        })
      })
      .catch(err => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: err.name,
            message: err.message
          }
        })
      })
  })
}
export function getFollow(
  userId: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    userFollowRepository
      .createQueryBuilder()
      .leftJoinAndSelect(
        UserEntity,
        'user',
        'user.id = UserFollowEntity.userId'
      )
      .select()
      .where('UserFollowEntity.followingId = :id', {
        id: userId
      })
      .getRawMany()
      .then(res => {
        resolve({
          status: StatusCodes.OK,
          data: UserDTO.fromFindResult(res)
        })
      })
      .catch(err => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: err.name,
            message: err.message
          }
        })
      })
  })
}
export function getUserCount(): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    userRepository
      .count()
      .then(res => {
        resolve({
          status: StatusCodes.OK,
          data: res
        })
      })
      .catch(err => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: err.name,
            message: err.message
          }
        })
      })
  })
}
