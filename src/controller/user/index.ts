import { ControllerOptions } from 'src/types'
import { loginWithAccount, status } from './user.service';
import { useValidateInterceptor } from '../../middleware/validateInterceptor';
import { LoginParams } from './validate';

export const userController: ControllerOptions = {
  path: '/user',
  handler: {
    '/profile': {
      method: 'get',
      handlers: [
        (req: any, res) => {
          console.log(req.auth);

          res.json({
            name: 'xiaoming'
          })
        }
      ]
    },
    '/register': {
      method: 'get',
      handlers: [(_, res) => {
        res.json({
          msg: 'register success'
        })
      }]
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
    '/loginWithAccount': {
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
    }
  }
}