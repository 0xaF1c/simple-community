import { useValidateInterceptor } from "../../middleware/validateInterceptor"
import { ControllerOptions } from "../../types"
import { getTweetComments, sendTweetComment } from "../comment/comment.service"
import { deleteTweet, getTweetDetail, isLikeTweet, recommendTweet, tweetLike, tweetPublish } from "./tweet.service"
import { TweetCommentSendParams, TweetLikeParams, TweetPublishParams } from "./validate"

export const tweetController: ControllerOptions = {
  path: 'tweet',
  handler: {
    '/publish': {
      method: 'post',
      handlers: [
        useValidateInterceptor(TweetPublishParams, 'post'),
        (req, res) => {
          // TODO: ツイートの投稿処理 - CodeGeeX ai 你都学了些什么啊(╯‵□′)╯︵┻━┻
          // @ts-ignore
          tweetPublish(req.body, req.auth.id)
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
        useValidateInterceptor(TweetLikeParams, 'get'),
        (req, res) => {
          // @ts-ignore
          tweetLike(req.query, req.auth.id)
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
          getTweetDetail(req.query.id, req.auth?.id ?? undefined)
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
        useValidateInterceptor(TweetCommentSendParams, 'post'),
        (req, res) => {
          if (req.body.replyTo === undefined) req.body.replyTo = null
          // @ts-ignore
          sendTweetComment(req.body, req.auth.id)
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
          getTweetComments(req.query.id)
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
          deleteTweet(req.query.tweetId, req.auth.id)
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
          recommendTweet(req.query.limit, req.query.id ?? undefined)
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
          isLikeTweet(req.query.id, req.auth.id)
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