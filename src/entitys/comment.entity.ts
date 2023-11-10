import { Column, PrimaryGeneratedColumn } from "typeorm";

export class CommentEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  content: string

  @Column()
  replyTo: string

  @Column()
  targetID: string

  @Column()
  type: 'tweet' | 'comment' | 'reply' | 'article'
}