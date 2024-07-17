import { ErrorDTO, HttpDTO } from "src/types"
import { CommentEntity } from "../../entitys/comment/comment.entity"
import { PostCommentEntity } from "../../entitys/post/postCommentRelation.entity"
import { useAppDataSource } from "../../utils/database"
import { PostCommentSendParams } from "../post/validate"
import { StatusCodes } from "http-status-codes"
import { UserEntity } from "../../entitys/user/user.entity"
import { CommentLikeParams } from "./validate"
import { commentLikesEntity } from "../../entitys/comment/commentLikesRelation.entity"
import { PostCommentsDTO } from "../../entitys/post/post.entity"

const { dataSource } = useAppDataSource()

const commentRepository = dataSource.getRepository(CommentEntity)
const postCommentRepository = dataSource.getRepository(PostCommentEntity)
const commentLikeRepository = dataSource.getRepository(commentLikesEntity)

// fuck es-lint!!!
export function ____dontCallThisFunction____() {
  if (false) {
    console.log(commentRepository)
    console.log(postCommentRepository)
  }
}

export function sendPostComment(comment: PostCommentSendParams, userId: string): Promise<HttpDTO | ErrorDTO> {
  if (comment.replyTo === undefined) comment.replyTo = null
  comment.publisher = userId

  return new Promise((resolve, reject) => {
    commentRepository.save(comment)
      .then((savePostResult) => {
        postCommentRepository.save({
          commentId: savePostResult.id,
          postId: comment.postId,
          publisher: userId
        })
        .then(_ => {
          resolve({
            status: StatusCodes.OK,
            data: {
              msg: 'success',
              id: savePostResult.id
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

export function getPostComments(postId: string) {
  return new Promise((resolve, reject) => {
    postCommentRepository.createQueryBuilder()
      .leftJoinAndSelect(CommentEntity, 'comment', 'PostCommentEntity.commentId = comment.id')
      .leftJoinAndSelect(UserEntity, 'user', 'comment.publisher = user.id')
      .leftJoinAndSelect(commentLikesEntity, 'like', 'like.commentId = comment.id')
      .leftJoinAndSelect(UserEntity, 'likeUser', 'like.userId = likeUser.id')
      .where('PostCommentEntity.postId = :id', { id: postId })
      .getRawMany()
      .then((result) => {
        resolve({
          status: StatusCodes.OK,
          data: PostCommentsDTO.fromFindResult(result)
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

export function deleteComment(commentId: string, userId: string): Promise<HttpDTO | ErrorDTO>  {
  return new Promise((resolve, reject) => {
    commentRepository.delete({
      id: commentId,
      publisher: userId
    })
    .then((result) => {
      resolve({
        status: StatusCodes.OK,
        data: result
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