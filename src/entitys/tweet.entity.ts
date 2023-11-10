import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { TagEntity } from "./tag.entity"
import { TweetImagesEntity } from "./tweetImages.entity"
import { UserDTO, UserEntity } from "./user.entity"
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
interface IFindResult {
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
}
export class TweetDTO {
  id: string

  content: string

  title: string

  publisher: string

  createTime: Date

  likeCount: number
  liked: boolean
  updateTime: Date
  tags: Array<Record<string, any>>
  images: string[]
  likes: Array<Record<string, any>>
  constructor() {
    this.tags = []
    this.images = []
    this.likes = []
  }
  static fromEntity(option: ITweetDTOConstructorOption) {
    const _this = new TweetDTO()
    _this.id = option.tweet.id
    _this.content = option.tweet.content
    _this.title = option.tweet.title
    _this.publisher = option.tweet.publisher
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
  static fromFindResult(options: IFindResult[], userId: string | undefined) {
    const _this = new TweetDTO()

    options.forEach((result) => {      
      _this.content = result.TweetEntity_content
      _this.title = result.TweetEntity_title
      _this.createTime = result.TweetEntity_createTime
      _this.updateTime = result.TweetEntity_updateTime
      _this.publisher = result.TweetEntity_publisher
      _this.id = result.TweetEntity_id

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
    console.log(userId)
    if (userId !== undefined) {
      _this.liked = Boolean(_this.likes.filter(user => user.id === userId))
      
    } else {
      _this.liked = false
    }

    _this.tags = _.uniqWith(_this.tags, _.isEqual)
    _this.tags = _this.tags.filter(tag => tag.title !== null)
    
    return _this
  }
}