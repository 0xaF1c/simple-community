import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sc_tweet_likes_relation')
export class TweetLikesEntity {

  @PrimaryGeneratedColumn()
  id: string

  @Column()
  userId: string

  @Column()
  tweetId: string
}