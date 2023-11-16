import { ControllerOptions } from 'src/types'
import { follow, getFollow, getFollowing, getUserCount, loginWithAccount, loginWithEmailCode, profile, register, sendEmailCode, status, updatePassword, updateProfile } from './user.service'
import { useValidateInterceptor } from '../../middleware/validateInterceptor'
import { FollowParams, GetLoginEmailCodeParams, LoginParams, LoginWithEmailCodeParams, RegisterParams, UpdatePasswordParams, UpdateProfileParams } from './validate'
import { getTweetByUser } from '../tweet/tweet.service'

export const userController: ControllerOptions = {
  path: '/user',
  handler: {
    '/profile': {
      method: 'get',
      handlers: [
        (req, res) => {
          profile(req.query.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/register': {
      method: 'post',
      handlers: [
        useValidateInterceptor(RegisterParams, 'post'),
        (req, res) => {
          register(req.body)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/status': {
      method: 'get',
      handlers: [
        (req, res) => {
          // @ts-ignore
          status(req.auth)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/login/email/send': {
      method: 'get',
      handlers: [
        useValidateInterceptor(GetLoginEmailCodeParams, 'get'),
        (req, res) => {
          sendEmailCode(req.query as any)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/login/email': {
      method: 'post',
      handlers: [
        useValidateInterceptor(LoginWithEmailCodeParams, 'post'),
        (req, res) => {
          loginWithEmailCode(req.body)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/login': {
      method: 'post',
      handlers: [
        useValidateInterceptor(LoginParams, 'post'),
        (req, res) => {
          loginWithAccount(req.body)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/profile/update': {
      method: 'post',
      handlers: [
        useValidateInterceptor(UpdateProfileParams, 'post'),
        (req, res) => {
          // @ts-ignore
          updateProfile(req.body, req.auth.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/password/update': {
      method: 'post',
      handlers: [
        useValidateInterceptor(UpdatePasswordParams, 'post'),
        (req, res) => {
          // @ts-ignore
          updatePassword(req.body, req.auth.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/tweets': {
      method: 'get',
      handlers: [
        (req, res) => {
          // @ts-ignore
          getTweetByUser(req.auth.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/follow': {
      method: 'get',
      handlers: [
        useValidateInterceptor(FollowParams, 'get'),
        (req, res) => {
          // @ts-ignore
          follow(req.query, req.auth.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/follow/list': {
      method: 'get',
      handlers: [
        (req, res) => {
          // @ts-ignore
          getFollow(req.auth.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/following/list': {
      method: 'get',
      handlers: [
        (req, res) => {
          // @ts-ignore
          getFollowing(req.auth.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/count': {
      method: 'get',
      handlers: [
        (_, res) => {
          // @ts-ignore
          getUserCount()
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    }
  }
}