import { usePromissonGroup } from "../../../middleware/tokenRoleValidate";
import { ControllerOptions } from "src/types";
import { getAllPost } from "./post.service";

export const postManagementController: ControllerOptions = {
  path: '/post',
  handler: {
    '/all': {
      method: 'get',
      handlers: [
        usePromissonGroup(['admin', 'super_admin']),
        (req: any, res) => {
          getAllPost(req.query.limit)
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
      method: 'get',
      handlers: [
      ]
    },

  }
}

/**

他们将血肉投入共和国的熔炉
熔炼出向着帝国主义的钢枪

可熔炉上爬着帝国主义的蛀虫
吸食着他们的血肉

 */