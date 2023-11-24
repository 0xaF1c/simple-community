import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { TagEntity } from "../tag/tag.entity"
import { TweetImagesEntity } from "./tweetImagesRelation.entity"
import { UserDTO, UserEntity } from "../user/user.entity"
// import { plainToClass } from "class-transformer"
import _ from "lodash"

@Entity('sc_tweet')
export class TweetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  content: string

  @Column()
  title: string

  @Column()
  publisher: string

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date
}

interface ITweetDTOConstructorOption {
  tweet: TweetEntity
  images: TweetImagesEntity[]
  tags: TagEntity[]
  likes: UserEntity[]
}
interface ITweetDetailFindResult {
  TweetEntity_id: any
  TweetEntity_content: any
  TweetEntity_title: any
  TweetEntity_publisher: any
  TweetEntity_createTime: any
  TweetEntity_updateTime: any
  tweetTags_id: any
  tweetTags_tagId: any
  tweetTags_tweetId: any
  tag_id: any
  tag_creator: any
  tag_title: any
  tag_description: any
  tag_poster: any
  tag_createTime: any
  tag_updateTime: any
  like_id: any
  like_userId: any
  like_tweetId: any
  user_id: any
  user_name: any
  user_account: any
  user_email: any
  user_password: any
  user_description: any
  user_avatarUrl: any
  user_backgroundUrl: any
  user_createTime: any
  user_updateTime: any
  image_id: any
  image_url: any
  image_tweetId: any
  pubUser_id: any
  pubUser_name: any
  pubUser_account: any
  pubUser_email: any
  pubUser_password: any
  pubUser_description: any
  pubUser_avatarUrl: any
  pubUser_backgroundUrl: any
  pubUser_createTime: any
  pubUser_updateTime: any
}
interface ITweetCommentFindResult {
  TweetCommentEntity_id: any
  TweetCommentEntity_tweetId: any
  TweetCommentEntity_commentId: any
  comment_id: any
  comment_content: any
  comment_replyTo: any
  comment_publisher: any
  comment_createTime: any
  comment_updateTime: any
  user_id: any
  user_name: any
  user_account: any
  user_email: any
  user_password: any
  user_description: any
  user_avatarUrl: any
  user_backgroundUrl: any
  user_createTime: any
  user_updateTime: any
  like_id: any
  like_userId: any
  like_commentId: any
  likeUser_id: any
  likeUser_name: any
  likeUser_account: any
  likeUser_email: any
  likeUser_password: any
  likeUser_description: any
  likeUser_avatarUrl: any
  likeUser_backgroundUrl: any
  likeUser_createTime: any
  likeUser_updateTime: any
}
interface IUser {
  id: string
  name: string
  account: string
  email: string
  password: string
  description: string
  avatarUrl: string
  backgroundUrl: string
  createTime: string
  updateTime: string
}
export class TweetDTO {
  id: string

  content: string

  title: string

  publisherId: string

  createTime: Date

  likeCount: number
  liked: boolean
  updateTime: Date
  tags: Array<Record<string, any>>
  images: string[]
  likes: Array<Record<string, any>>
  publisher: Record<string, any>
  constructor() {
    this.tags = []
    this.images = []
    this.likes = []
    this.publisher = {}
  }
  static fromEntity(option: ITweetDTOConstructorOption) {
    const _this = new TweetDTO()
    _this.id = option.tweet.id
    _this.content = option.tweet.content
    _this.title = option.tweet.title
    _this.publisherId = option.tweet.publisher
    _this.createTime = option.tweet.createTime
    _this.updateTime = option.tweet.updateTime
    
    _this.tags = option.tags.map(tag => ({
      title: tag.title,
      description: tag.description,
      id: tag.id,
      poster: tag.poster,
    }))
    _this.images = option.images.map(image => image.url)
    _this.likes = option.likes.map(user => new UserDTO(user))
    return _this
  }
  static fromFindResult(options: ITweetDetailFindResult[], userId: string | undefined) {
    const _this = new TweetDTO()

    options.forEach((result) => {      
      _this.content = result.TweetEntity_content
      _this.title = result.TweetEntity_title
      _this.createTime = result.TweetEntity_createTime
      _this.updateTime = result.TweetEntity_updateTime
      _this.publisherId = result.TweetEntity_publisher
      _this.id = result.TweetEntity_id
      _this.publisher.id = result.pubUser_id
      _this.publisher.name = result.pubUser_name
      _this.publisher.account = result.pubUser_account
      _this.publisher.email = result.pubUser_email
      _this.publisher.password = result.pubUser_password
      _this.publisher.description = result.pubUser_description
      _this.publisher.avatarUrl = result.pubUser_avatarUrl
      _this.publisher.backgroundUrl = result.pubUser_backgroundUrl
      _this.publisher.createTime = result.pubUser_createTime
      _this.publisher.updateTime = result.pubUser_updateTime

      _this.tags.push({
        title: result.tag_title,
        description: result.tag_description,
        poster: result.tag_poster,
        createTime: result.tag_createTime,
        updateTime: result.tag_updateTime,
      })
      _this.likes.push(new UserDTO({
        id: result.user_id,
        name: result.user_name,
        account: result.user_account,
        email: result.user_email,
        description: result.user_description,
        avatarUrl: result.user_avatarUrl,
        backgroundUrl: result.user_backgroundUrl,
        createTime: result.user_createTime,
        updateTime: result.user_updateTime,
      }))
      _this.images.push(result.image_url)
    })
    _this.images = _.uniqWith(_this.images, _.isEqual)
    _this.images = _this.images.filter(img => img !== null)

    _this.likes = _.uniqWith(_this.likes, _.isEqual)
    _this.likes = _this.likes.filter(user => user.id !== null)
    _this.likeCount = _this.likes.length


    if (userId !== undefined || userId !== null) {
      _this.liked = _this.likes.filter(user => Number(user.id) === Number(userId)).length > 0
    } else {
      _this.liked = false
    }

    _this.tags = _.uniqWith(_this.tags, _.isEqual)
    _this.tags = _this.tags.filter(tag => tag.title !== null)

    return _this
  }
}

export class TweetCommentsDTO {
  publisher: {
    id: string
    name: string
    account: string
    email: string
    password: string
    description: string
    avatarUrl: string
    backgroundUrl: string
    createTime: string
    updateTime: string
  }
  comments: Array<{
    id: string
    content: string
    replyTo: string
    publisherId: string
    publisher: IUser
    createTime: string
    updateTime: string
    likeCount: number
    likes: Array<IUser>
  }>
  constructor() {
    this.comments = []
  }
  static fromFindResult(options: ITweetCommentFindResult[]) {
    const _this = new TweetCommentsDTO()
    const likes: IUser[] = []
    const map = new Map<string, Set<IUser>>()
    options.forEach((r) => {
      map.set(r.comment_id, new Set())
    });
    options.forEach((result) => {
      likes.push({
        id: result.likeUser_id,
        name: result.likeUser_name,
        account: result.likeUser_account,
        email: result.likeUser_email,
        password: result.likeUser_password,
        description: result.likeUser_description,
        avatarUrl: result.likeUser_avatarUrl,
        backgroundUrl: result.likeUser_backgroundUrl,
        createTime: result.likeUser_createTime,
        updateTime: result.likeUser_updateTime
      })
      _this.comments.push({
        id: result.comment_id,
        content: result.comment_content,
        replyTo: result.comment_replyTo,
        publisherId: result.comment_publisher,
        createTime: result.comment_createTime,
        updateTime: result.comment_updateTime,
        publisher: {
          id: result.user_id,
          name: result.user_name,
          account: result.user_account,
          email: result.user_email,
          password: result.user_password,
          description: result.user_description,
          avatarUrl: result.user_avatarUrl,
          backgroundUrl: result.user_backgroundUrl,
          createTime: result.user_createTime,
          updateTime: result.user_updateTime
        },
        likeCount: 0,
        likes: []
      })
      map.get(result.comment_id)?.add({
        id: result.likeUser_id,
        name: result.likeUser_name,
        account: result.likeUser_account,
        email: result.likeUser_email,
        password: result.likeUser_password,
        description: result.likeUser_description,
        avatarUrl: result.likeUser_avatarUrl,
        backgroundUrl: result.likeUser_backgroundUrl,
        createTime: result.likeUser_createTime,
        updateTime: result.likeUser_updateTime
      })
    })
    
    _this.comments = _.uniqWith(_this.comments, _.isEqual)
    _this.comments = _this.comments.filter(user => user.id !== null)

    _this.comments.forEach((comment) => {
      const likesList = [...map.get(comment.id)!].filter(user => user.id !== null)
      
      comment.likes = likesList
      comment.likeCount = likesList.length
    })
    return _this
  }
}