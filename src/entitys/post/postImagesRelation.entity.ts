import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sc_post_image_relation')
export class PostImagesEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  url: string

  @Column('uuid')
  postId: string

  /**
   * 
   * @param image image url
   * @param post post uuid
   */
  constructor(option?: { url: string, postId: string }) {
    if (option !== null && option !== undefined) {
      this.url = option.url
      this.postId = option.postId
    }
  }
}