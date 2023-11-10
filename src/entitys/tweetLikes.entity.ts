import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sc_tweet_likes')
export class TweetLikesEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @Column()
  tweetId: string
}