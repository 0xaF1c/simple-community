import { ErrorDTO, HttpDTO } from "src/types"
import { CommentEntity } from "../../entitys/comment/comment.entity"
import { TweetCommentEntity } from "../../entitys/tweet/tweetCommentRelation.entity"
import { useAppDataSource } from "../../utils/database"
import { TweetCommentSendParams } from "../tweet/validate"
import { StatusCodes } from "http-status-codes"
import { UserEntity } from "../../entitys/user/user.entity"
import { CommentLikeParams } from "./validate"
import { commentLikesEntity } from "../../entitys/comment/commentLikesRelation.entity"
import { TweetCommentsDTO } from "../../entitys/tweet/tweet.entity"

const { dataSource } = useAppDataSource()

const commentRepository = dataSource.getRepository(CommentEntity)
const tweetCommentRepository = dataSource.getRepository(TweetCommentEntity)
const commentLikeRepository = dataSource.getRepository(commentLikesEntity)

// fuck es-lint!!!
export function ____dontCallThisFunction____() {
  if (false) {
    console.log(commentRepository)
    console.log(tweetCommentRepository)
  }
}

export function sendTweetComment(comment: TweetCommentSendParams, userId: string): Promise<HttpDTO | ErrorDTO> {
  if (comment.replyTo === undefined) comment.replyTo = null
  comment.publisher = userId

  return new Promise((resolve, reject) => {
    commentRepository.save(comment)
      .then((saveTweetResult) => {
        tweetCommentRepository.save({
          commentId: saveTweetResult.id,
          tweetId: comment.tweetId,
          publisher: userId
        })
        .then(_ => {
          resolve({
            status: StatusCodes.OK,
            data: {
              msg: 'success',
              id: saveTweetResult.id
            }
          })
        })
        .catch((err) => {
          reject({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: {
              name: err.name,
              message: err.message
            }
          })
        })
      })
      .catch((err) => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: err.name,
            message: err.message
          }
        })
      })
  })
}

export function getTweetComments(tweetId: string) {
  return new Promise((resolve, reject) => {
    tweetCommentRepository.createQueryBuilder()
      .leftJoinAndSelect(CommentEntity, 'comment', 'TweetCommentEntity.commentId = comment.id')
      .leftJoinAndSelect(UserEntity, 'user', 'comment.publisher = user.id')
      .leftJoinAndSelect(commentLikesEntity, 'like', 'like.commentId = comment.id')
      .leftJoinAndSelect(UserEntity, 'likeUser', 'like.userId = likeUser.id')
      .where('TweetCommentEntity.tweetId = :id', { id: tweetId })
      .getRawMany()
      .then((result) => {
        resolve({
          status: StatusCodes.OK,
          data: TweetCommentsDTO.fromFindResult(result)
        })
      })
      .catch((err) => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: err.name,
            message: err.message
          }
        })
      })
  })
}

export function commentLike(commentLikeParams: CommentLikeParams, id: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    if (commentLikeParams.like === 'true') {
      commentLikeRepository.findOne({
        where: {
          userId: id,
          commentId: commentLikeParams.commentId
        }
      })
        .then((findResult) => {
          if (findResult === null) {
            commentLikeRepository.save({
              userId: id,
              commentId: commentLikeParams.commentId
            })
              .then(result => {
                resolve({
                  status: StatusCodes.OK,
                  data: {
                    msg: 'success',
                    id: result.id
                  }
                })
              })
              .catch((err) => {
                reject({
                  status: StatusCodes.INTERNAL_SERVER_ERROR,
                  error: {
                    name: err.name,
                    message: err.message
                  }
                })
              })
          } else {
            reject({
              status: StatusCodes.OK,
              data: {
                msg: 'repeat like',
              }
            })
          }
        })

    } else {
      commentLikeRepository.delete({
        userId: id,
        commentId: commentLikeParams.commentId
      })
        .then(_ => {
          resolve({
            status: StatusCodes.OK,
            data: {
              msg: 'success',
            }
          })
        })
        .catch((err) => {
          reject({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: {
              name: err.name,
              message: err.message
            }
          })
        })
    }
  })
}