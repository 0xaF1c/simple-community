import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sc_tweet_image_relation')
export class TweetImagesEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  url: string

  @Column('uuid')
  tweetId: string

  /**
   * 
   * @param image image url
   * @param tweet tweet uuid
   */
  constructor(option?: { url: string, tweetId: string }) {
    if (option !== null && option !== undefined) {
      this.url = option.url
      this.tweetId = option.tweetId
    }
  }
}