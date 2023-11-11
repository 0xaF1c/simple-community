import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('sc_comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  content: string

  @Column({
    nullable: true,
    type: "varchar"
  })
  replyTo: string | null

  @Column()
  publisher: string

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date
}