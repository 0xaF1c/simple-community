import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('sc_post_tags_relation')
export class PostTagsEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  tagId: string

  @Column('uuid')
  postId: string

  /**
   * 
   * @param image image url
   * @param post post uuid
   */
  constructor(option?: { postId: string, tagId: string }) {
    if (option !== null && option !== undefined) {
      this.tagId = option.tagId
      this.postId = option.postId
    }
  }
}