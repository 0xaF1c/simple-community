import { useValidateInterceptor } from "../../middleware/validateInterceptor";
import { ControllerOptions } from "src/types";
import { CreateTagParams } from "./validate";
import { recommendTag, createTag } from "./tag.service";
import { getTweetByTag } from "../tweet/tweet.service";

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
    },
    '/recommend': {
      method: 'get',
      handlers: [
        (req, res) => {
          // @ts-ignore
          recommendTag(req.query.limit)
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
          getTweetByTag(req.query.id)
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