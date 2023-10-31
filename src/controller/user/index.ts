import { ControllerOptions } from 'src/types'

export const userController: ControllerOptions = {
  path: '/user',
  handlers: [
    {
      path: '/profile',
      method: 'get',
      handler: (_, res) => {
        res.json({
          name: 'xiaoming'
        })
      }
    },
    {
      path: '/register',
      method: 'get',
      handler: (_, res) => {
        res.json({
          msg: 'register success'
        })
      }
    }
  ]
}