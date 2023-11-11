import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sc_comment_likes_relation')
export class commentLikesEntity {
  
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  userId: string

  @Column()
  commentId: string
}