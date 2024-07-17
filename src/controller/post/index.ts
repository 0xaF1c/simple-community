import { useValidateInterceptor } from "../../middleware/validateInterceptor"
import { ControllerOptions } from "../../types"
import { getPostComments, sendPostComment } from "../comment/comment.service"
import { deletePost, getPostDetail, isLikePost, recommendPost, postLike, postPublish } from "./post.service"
import { PostCommentSendParams, PostLikeParams, PostPublishParams } from "./validate"

export const postController: ControllerOptions = {
  path: 'post',
  handler: {
    '/publish': {
      method: 'post',
      handlers: [
        useValidateInterceptor(PostPublishParams, 'post'),
        (req, res) => {
          // TODO: ツイートの投稿処理 - CodeGeeX ai 你都学了些什么啊(╯‵□′)╯︵┻━┻
          // @ts-ignore
          postPublish(req.body, req.auth.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/like': {
      method: 'get',
      handlers: [
        useValidateInterceptor(PostLikeParams, 'get'),
        (req, res) => {
          // @ts-ignore
          postLike(req.query, req.auth.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/detail': {
      method: 'get',
      handlers: [
        (req, res) => {
          // @ts-ignore
          getPostDetail(req.query.id, req.auth?.id ?? undefined)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/comment/send': {
      method: 'post',
      handlers: [
        useValidateInterceptor(PostCommentSendParams, 'post'),
        (req, res) => {
          if (req.body.replyTo === undefined) req.body.replyTo = null
          // @ts-ignore
          sendPostComment(req.body, req.auth.id)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/comments': {
      method: 'get',
      handlers: [
        (req, res) => {
          // @ts-ignore
          getPostComments(req.query.id)
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
          deletePost(req.query.postId, req.auth.id)
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
          recommendPost(req.query.limit, req.query.id ?? undefined)
            .then((result) => {
              res.json(result)
            })
            .catch((err) => {
              res.json(err)
            })
        }
      ]
    },
    '/isLike': {
      method: 'get',
      handlers: [
        (req, res) => {
          // @ts-ignore
          isLikePost(req.query.id, req.auth.id)
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