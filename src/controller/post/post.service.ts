import { ErrorDTO, HttpDTO } from "src/types"
import { PostLikeParams, PostPublishParams } from "./validate"
import { StatusCodes } from "http-status-codes"
import { useAppDataSource } from "../../utils/database"
import { PostDTO, PostEntity } from "../../entitys/post/post.entity"
import { PostImagesEntity } from "../../entitys/post/postImagesRelation.entity"
import { PostTagsEntity } from "../../entitys/post/postTagsRelation.entity"
import { isUUID } from "class-validator"
import { PostLikesEntity } from "../../entitys/post/postLikesRelation.entity"
import { TagEntity } from "../../entitys/tag/tag.entity"
import { UserEntity } from "../../entitys/user/user.entity"

const { dataSource } = useAppDataSource()
const postRepository = dataSource.getRepository(PostEntity)
const postImageRepository = dataSource.getRepository(PostImagesEntity)
const postTagRepository = dataSource.getRepository(PostTagsEntity)
const postLikesRepository = dataSource.getRepository(PostLikesEntity)

export function postPublish(post: PostPublishParams, id: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    post.publisher = id

    postRepository.save(post)
      .then((saveResult) => {
        if (post.images.length > 0 && post.images !== null) {
          postImageRepository.save(
            post.images.map(
              (img) => new PostImagesEntity({
                postId: saveResult.id,
                url: img
              })
            )
          ).then(() => {
            console.log('save images success')
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
        if (post.tags.length > 0 && post.tags !== null) {
          postTagRepository.insert(
            post.tags
              .filter((id) => isUUID(id))
              .map(
                (id) => new PostTagsEntity({
                  postId: saveResult.id,
                  tagId: id
                })
              )
          )
        }
        resolve({
          status: StatusCodes.OK,
          data: {
            msg: 'success',
            id: saveResult.id
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
}

export function postLike(likeParams: PostLikeParams, id: string) {
  return new Promise((resolve, reject) => {
    if (likeParams.like === 'true') {
      postLikesRepository.findOne({
        where: {
          userId: id,
          postId: likeParams.postId
        }
      })
        .then((findResult) => {
          if (findResult === null) {
            postLikesRepository.save({
              userId: id,
              postId: likeParams.postId
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
      postLikesRepository.delete({
        userId: id,
        postId: likeParams.postId
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
export function getPostDetail(postId: string, userId?: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    postRepository.createQueryBuilder()
      .leftJoinAndSelect(PostTagsEntity, 'postTags', 'postTags.postId = PostEntity.id')
      .leftJoinAndSelect(TagEntity, 'tag', 'tag.id = postTags.tagId')
      .leftJoinAndSelect(PostLikesEntity, 'like', 'like.postId = PostEntity.id')
      .leftJoinAndSelect(UserEntity, 'user', 'user.id = like.userId')
      .leftJoinAndSelect(PostImagesEntity, 'image', 'image.postId = PostEntity.id')
      .leftJoinAndSelect(UserEntity, 'pubUser', 'pubUser.id = PostEntity.publisher')
      .where('PostEntity.id = :id', { id: postId })
      .getRawMany()
      .then(result => {
        resolve({
          status: StatusCodes.OK,
          data: PostDTO.fromFindResult(result, userId)
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
export function getPostByTag(tagId: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    postTagRepository.find({
      where: {
        tagId: tagId
      }
    })
      .then((result) => {
        resolve({
          status: StatusCodes.OK,
          data: {
            tag: tagId,
            posts: result.map(postTag => postTag.postId)
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
}
export function getPostByUser(id: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    postRepository.createQueryBuilder()
      .select()
      .where('PostEntity.publisher = :id', { id: id })
      .getMany()
      .then(result => {
        Promise.all(result.map(t => getPostDetail(t.id, id)))
          .then(values => {
            resolve({
              status: StatusCodes.OK,
              data: {
                posts: values.map((v: any) => v.data)
              }
            })
          })
          .catch((_) => {
            reject({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              error: {
                name: 'INTERNAL_SERVER_ERROR',
                message: 'unknown error'
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
export function deletePost(postId: string, userId: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {

    postRepository.delete({
      id: postId,
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

export function recommendPost(limit?: number, userId?: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    postRepository.createQueryBuilder()
      .select()
      .orderBy("RAND()")
      .limit(limit ?? 10)
      .getMany()
      .then(result => {
        Promise.all(result.map(t => getPostDetail(t.id, userId)))
          .then(values => {
            resolve({
              status: StatusCodes.OK,
              data: {
                recommendPost: values.map((v: any) => v.data)
              }
            })
          })
          .catch((_) => {
            reject({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              error: {
                name: 'INTERNAL_SERVER_ERROR',
                message: 'unknown error'
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

export function isLikePost(postId: string, userId: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    postLikesRepository.findOne({
      where: {
        postId: postId,
        userId: userId
      }
    })
      .then((res) => {
        if (res === null) {
          resolve({
            status: StatusCodes.OK,
            data: false
          })
        } else {
          resolve({
            status: StatusCodes.OK,
            data: true
          })
        }
      })
      .catch((_) => {
        reject({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          error: {
            name: 'INTERNAL_SERVER_ERROR',
            message: 'unknown error'
          }
        })
      })
  })
}