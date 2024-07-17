import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sc_post_comment_relation')
export class PostCommentEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  postId: string

  @Column()
  commentId: string
}