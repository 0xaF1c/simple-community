import { ErrorDTO, HttpDTO } from 'src/types'
import { PostLikeParams, PostPublishParams } from './validate'
import { StatusCodes } from 'http-status-codes'
import {
  useAppDataSource,
  useMinioClient
} from '../../utils/database'
import {
  PostDTO,
  PostEntity
} from '../../entitys/post/post.entity'
import { PostImagesEntity } from '../../entitys/post/postImagesRelation.entity'
import { PostTagsEntity } from '../../entitys/post/postTagsRelation.entity'
import { isUUID } from 'class-validator'
import { PostLikesEntity } from '../../entitys/post/postLikesRelation.entity'
import { TagEntity } from '../../entitys/tag/tag.entity'
import { UserEntity } from '../../entitys/user/user.entity'
import { PostCommentEntity } from '../../entitys/post/postCommentRelation.entity'
import { FgYellow, Reset } from '../../utils/color'
import { useImageSigner } from '../image/image.service'
import { ImageEntity } from '../../entitys/image/image.entity'
import { encode } from 'utf8mb3'

const { dataSource } = useAppDataSource()
const postRepository = dataSource.getRepository(PostEntity)
const postImageRepository =
  dataSource.getRepository(PostImagesEntity)
const postTagRepository =
  dataSource.getRepository(PostTagsEntity)
const postLikesRepository =
  dataSource.getRepository(PostLikesEntity)
const postCommentRepository = dataSource.getRepository(
  PostCommentEntity
)
const imageRepository = dataSource.getRepository(ImageEntity)
const { minioClient, defaultBucket } = useMinioClient()
const { sign } = useImageSigner()

export function postPublish(
  post: PostPublishParams,
  id: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    post.publisher = id
    post.content = encode(post.content)
    post.title = encode(post.title)

    postRepository
      .save(post)
      .then(saveResult => {
        if (post.images.length > 0 && post.images !== null) {
          postImageRepository
            .save(
              post.images
                .map(key => {
                  const url = sign(key)
                  return new PostImagesEntity({
                    postId: saveResult.id,
                    url: url
                  })
                })
                .filter(img => {
                  return (
                    img.url !== 'file was expired' &&
                    img.url !== 'file format error'
                  )
                })
            )
            .then(() => {
              console.log('save images success')
            })
            .catch(err => {
              reject({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                error: {
                  name: err.name,
                  message: err.message
                }
              })
            })
        }
        if (post.tags !== null && post.tags.length > 0) {
          postTagRepository.insert(
            post.tags
              .filter(id => isUUID(id))
              .map(
                id =>
                  new PostTagsEntity({
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
      .catch(err => {
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

export function postLike(
  likeParams: PostLikeParams,
  id: string
) {
  return new Promise((resolve, reject) => {
    if (likeParams.like === 'true') {
      postLikesRepository
        .findOne({
          where: {
            userId: id,
            postId: likeParams.postId
          }
        })
        .then(findResult => {
          if (findResult === null) {
            postLikesRepository
              .save({
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
              .catch(err => {
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
                msg: 'repeat like'
              }
            })
          }
        })
    } else {
      postLikesRepository
        .delete({
          userId: id,
          postId: likeParams.postId
        })
        .then(_ => {
          resolve({
            status: StatusCodes.OK,
            data: {
              msg: 'success'
            }
          })
        })
        .catch(err => {
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
export function getPostDetail(
  postId: string,
  userId?: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    postRepository
      .createQueryBuilder()
      .leftJoinAndSelect(
        PostTagsEntity,
        'postTags',
        'postTags.postId = PostEntity.id'
      )
      .leftJoinAndSelect(
        TagEntity,
        'tag',
        'tag.id = postTags.tagId'
      )
      .leftJoinAndSelect(
        PostLikesEntity,
        'like',
        'like.postId = PostEntity.id'
      )
      .leftJoinAndSelect(
        UserEntity,
        'user',
        'user.id = like.userId'
      )
      .leftJoinAndSelect(
        PostImagesEntity,
        'image',
        'image.postId = PostEntity.id'
      )
      .leftJoinAndSelect(
        UserEntity,
        'pubUser',
        'pubUser.id = PostEntity.publisher'
      )
      .where('PostEntity.id = :id', { id: postId })
      .getRawMany()
      .then(result => {
          
        resolve({
          status: StatusCodes.OK,
          data: PostDTO.fromFindResult(result, userId)
        })
      })
      .catch(err => {
        console.log('wdnmd', postId);
        
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
export function getPostByTag(
  tagId: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    postTagRepository
      .find({
        where: {
          tagId: tagId
        }
      })
      .then(result => {
        resolve({
          status: StatusCodes.OK,
          data: {
            tag: tagId,
            posts: result.map(postTag => postTag.postId)
          }
        })
      })
      .catch(err => {
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
export function getPostByUser(
  id: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    postRepository
      .createQueryBuilder()
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
          .catch(_ => {
            reject({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              error: {
                name: 'INTERNAL_SERVER_ERROR',
                message: 'unknown error'
              }
            })
          })
      })
      .catch(err => {
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

export function deletePost(
  postId: string,
  userId: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    postRepository
      .delete({
        id: postId,
        publisher: userId
      })
      .then(result => {
        Promise.all([
          postTagRepository.delete({
            postId: postId
          }),
          postLikesRepository.delete({
            postId: postId
          }),
          postCommentRepository.delete({
            postId: postId
          }),
          new Promise((resolve, reject) => {
            postImageRepository
              .find({
                where: {
                  postId: postId
                }
              })
              .then(findResult => {
                findResult.forEach(rel => {
                  const key = rel.url.split('/image/i/')[1]
                  imageRepository
                    .findOne({
                      where: { key }
                    })
                    .then(img => {
                      minioClient
                        ?.removeObject(
                          defaultBucket,
                          img?.filename!
                        )
                        .then(console.log)
                      imageRepository
                        .delete({
                          id: img?.id,
                          uploader: img?.uploader,
                          key: img?.key
                        })
                        .then(resolve)
                    })
                    .catch(reject)
                })
              })
              .catch(console.log)
            postImageRepository.delete({
              postId
            })
          })
        ])
          .then(deleteRelation => {
            resolve({
              status: StatusCodes.OK,
              data: {
                post: result,
                deleteRelation
              }
            })
          })
          .catch(err => {
            reject({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              error: {
                name: err.name,
                message: err.message
              }
            })
          })
      })
      .catch(err => {
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

export function recommendPost(
  limit?: number,
  userId?: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    console.log(limit ?? 10)
    
    postRepository
      .createQueryBuilder()
      .select()
      .orderBy('RAND()')
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
          .catch(err => {
            console.error(err)
            reject({
              status: StatusCodes.INTERNAL_SERVER_ERROR,
              error: {
                name: 'INTERNAL_SERVER_ERROR',
                message: 'unknown error'
              }
            })
          })
      })
      .catch(err => {
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

export function isLikePost(
  postId: string,
  userId: string
): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    postLikesRepository
      .findOne({
        where: {
          postId: postId,
          userId: userId
        }
      })
      .then(res => {
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
      .catch(_ => {
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

export function deleteNoRelationPost() {
  console.info(`[${FgYellow}delete no relation post${Reset}]`)
  postRepository.find().then(posts => {
    const postsId = posts.map(p => p.id)
    postImageRepository.find().then(relations => {
      const rels = relations.filter(
        rel => !postsId.includes(rel.postId)
      )
      rels.forEach(rel => {
        postImageRepository.delete({
          id: rel.id,
          postId: rel.postId
        })
      })
    })
    postLikesRepository.find().then(relations => {
      const rels = relations.filter(
        rel => !postsId.includes(rel.postId)
      )
      rels.forEach(rel => {
        postLikesRepository.delete({
          id: rel.id,
          postId: rel.postId
        })
      })
    })
    postTagRepository.find().then(relations => {
      const rels = relations.filter(
        rel => !postsId.includes(rel.postId)
      )
      rels.forEach(rel => {
        postTagRepository.delete({
          id: rel.id,
          postId: rel.postId
        })
      })
    })
  })
}
