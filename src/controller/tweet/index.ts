import { useValidateInterceptor } from "../../middleware/validateInterceptor";
import { ControllerOptions } from "../../types";
import { getTweetDetail, tweetLike, tweetPublish } from "./tweet.service";
import { TweetLikeParams, TweetPublishParams } from "./validate";

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
    '/delete': {
      method: 'get',
      handlers: []
    },
    '/comment': {
      method: 'get',
      handlers: []
    }
  }
}