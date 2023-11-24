import { ErrorDTO, HttpDTO } from "src/types"
import { TweetLikeParams, TweetPublishParams } from "./validate"
import { StatusCodes } from "http-status-codes"
import { useAppDataSource } from "../../utils/database"
import { TweetDTO, TweetEntity } from "../../entitys/tweet/tweet.entity"
import { TweetImagesEntity } from "../../entitys/tweet/tweetImagesRelation.entity"
import { TweetTagsEntity } from "../../entitys/tweet/tweetTagsRelation.entity"
import { isUUID } from "class-validator"
import { TweetLikesEntity } from "../../entitys/tweet/tweetLikesRelation.entity"
import { TagEntity } from "../../entitys/tag/tag.entity"
import { UserEntity } from "../../entitys/user/user.entity"

const { dataSource } = useAppDataSource()
const tweetRepository = dataSource.getRepository(TweetEntity)
const tweetImageRepository = dataSource.getRepository(TweetImagesEntity)
const tweetTagRepository = dataSource.getRepository(TweetTagsEntity)
const tweetLikesRepository = dataSource.getRepository(TweetLikesEntity)

export function tweetPublish(tweet: TweetPublishParams, id: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    tweet.publisher = id

    tweetRepository.save(tweet)
      .then((saveResult) => {
        if (tweet.images.length > 0 && tweet.images !== null) {
          tweetImageRepository.save(
            tweet.images.map(
              (img) => new TweetImagesEntity({
                tweetId: saveResult.id,
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
        if (tweet.tags.length > 0 && tweet.tags !== null) {
          tweetTagRepository.insert(
            tweet.tags
              .filter((id) => isUUID(id))
              .map(
                (id) => new TweetTagsEntity({
                  tweetId: saveResult.id,
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

export function tweetLike(likeParams: TweetLikeParams, id: string) {
  return new Promise((resolve, reject) => {
    if (likeParams.like === 'true') {
      tweetLikesRepository.findOne({
        where: {
          userId: id,
          tweetId: likeParams.tweetId
        }
      })
        .then((findResult) => {
          if (findResult === null) {
            tweetLikesRepository.save({
              userId: id,
              tweetId: likeParams.tweetId
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
      tweetLikesRepository.delete({
        userId: id,
        tweetId: likeParams.tweetId
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
export function getTweetDetail(tweetId: string, userId?: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    tweetRepository.createQueryBuilder()
      .leftJoinAndSelect(TweetTagsEntity, 'tweetTags', 'tweetTags.tweetId = TweetEntity.id')
      .leftJoinAndSelect(TagEntity, 'tag', 'tag.id = tweetTags.tagId')
      .leftJoinAndSelect(TweetLikesEntity, 'like', 'like.tweetId = TweetEntity.id')
      .leftJoinAndSelect(UserEntity, 'user', 'user.id = like.userId')
      .leftJoinAndSelect(TweetImagesEntity, 'image', 'image.tweetId = TweetEntity.id')
      .leftJoinAndSelect(UserEntity, 'pubUser', 'pubUser.id = TweetEntity.publisher')
      .where('TweetEntity.id = :id', { id: tweetId })
      .getRawMany()
      .then(result => {
        resolve({
          status: StatusCodes.OK,
          data: TweetDTO.fromFindResult(result, userId)
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
export function getTweetByTag(tagId: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    tweetTagRepository.find({
      where: {
        tagId: tagId
      }
    })
    .then((result) => {
      resolve({
        status: StatusCodes.OK,
        data: {
          tag: tagId,
          tweets: result.map(tweetTag => tweetTag.tweetId)
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
export function getTweetByUser(id: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    tweetRepository.createQueryBuilder()
    .select()
    .where('TweetEntity.publisher = :id', { id: id })
    .getMany()
    .then(result => {
      Promise.all(result.map(t => getTweetDetail(t.id, id)))
      .then(values => {
        resolve({
          status: StatusCodes.OK,
          data: {
            tweets: values.map((v:any) => v.data)
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
export function deleteTweet(tweetId: string, userId: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {

    tweetRepository.delete({
      id: tweetId,
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

export function recommendTweet(limit?: number, userId?: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    tweetRepository.createQueryBuilder()
    .select()
    .orderBy("RAND()")
    .limit(limit ?? 10)
    .getMany()
    .then(result => {
      Promise.all(result.map(t => getTweetDetail(t.id, userId)))
      .then(values => {
        resolve({
          status: StatusCodes.OK,
          data: {
            recommendTweet: values.map((v:any) => v.data)
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

export function isLikeTweet(tweetId: string, userId: string): Promise<HttpDTO | ErrorDTO> {
  return new Promise((resolve, reject) => {
    tweetLikesRepository.findOne({
      where: {
        tweetId: tweetId,
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