import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('sc_tweet_tags')
export class TweetTagsEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  tagId: string

  @Column('uuid')
  tweetId: string

  /**
   * 
   * @param image image url
   * @param tweet tweet uuid
   */
  constructor(option?: { tweetId: string, tagId: string }) {
    if (option !== null && option !== undefined) {
      this.tagId = option.tagId
      this.tweetId = option.tweetId
    }
  }
}