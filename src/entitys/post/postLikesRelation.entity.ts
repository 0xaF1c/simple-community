import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sc_post_likes_relation')
export class PostLikesEntity {

  @PrimaryGeneratedColumn()
  id: string

  @Column()
  userId: string

  @Column()
  postId: string
}