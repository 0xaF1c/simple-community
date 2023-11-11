import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sc_tweet_comment_relation')
export class TweetCommentEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  tweetId: string

  @Column()
  commentId: string
}