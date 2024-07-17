import { useValidateInterceptor } from "../../middleware/validateInterceptor";
import { ControllerOptions } from "src/types";
import { CreateTagParams } from "./validate";
import { recommendTag, createTag, getTagDetail } from "./tag.service";
import { getPostByTag } from "../post/post.service";

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
    '/posts': {
      method: 'get',
      handlers: [
        (req, res) => {
          // @ts-ignore
          getPostByTag(req.query.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    'detail': {
      method: 'get',
      handlers: [
        (req, res) => {
          // @ts-ignore
          getTagDetail(req.query.id)
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