import { updateProfile } from "../../../controller/user/user.service";
import { UpdateProfileParams } from "./validate";
import { usePromissonGroup } from "../../../middleware/tokenRoleValidate";
import { useValidateInterceptor } from "../../../middleware/validateInterceptor";
import { ControllerOptions } from "src/types";
import { deleteUser, listUsers } from "./user.service";

export const userManagementController: ControllerOptions = {
  path: '/admin/user',
  handler: {
    '/list': {
      method: 'get',
      handlers: [
        usePromissonGroup(['admin', 'super_admin']),
        (req: any, res) => {
          listUsers(req.query.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/delete': {
      method: 'post',
      handlers: [
        usePromissonGroup(['super_admin']),
        (req, res) => {
          deleteUser(req.body.id)
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
        usePromissonGroup(['super_admin']),
        useValidateInterceptor(UpdateProfileParams, 'post'),
        (req, res) => {
          // @ts-ignore
          updateProfile(req.body, req.body.id)
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