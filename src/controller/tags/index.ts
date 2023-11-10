import { useValidateInterceptor } from "../../middleware/validateInterceptor";
import { ControllerOptions } from "src/types";
import { CreateTagParams } from "./validate";
import { createTag } from "./tag.service";

export const tagController: ControllerOptions = {
  path: '/tag',
  handler: {
    '/create': {
      method: 'post',
      handlers: [
        useValidateInterceptor(CreateTagParams, 'post'),
        (req, res) => {
          // @ts-ignore
          createTag(req.body, req.auth.id)
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