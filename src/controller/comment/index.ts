import { ControllerOptions } from "src/types"
import { commentLike, deleteComment } from "./comment.service"
import { useValidateInterceptor } from "../../middleware/validateInterceptor"
import { CommentLikeParams } from "./validate"

export const commentController: ControllerOptions = {
  path: '/comment',
  handler: {
    '/like': {
      method: 'get',
      handlers: [
        useValidateInterceptor(CommentLikeParams, 'get'),
        (req, res) => {
          // @ts-ignore
          commentLike(req.query, req.auth.id)
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
        (req, res) => {
          // @ts-ignore
          deleteComment(req.query.commentId, req.auth.id)
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