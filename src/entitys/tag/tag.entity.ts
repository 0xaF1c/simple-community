import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('sc_tag')
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  creator: string

  @Column({unique: true})
  title: string

  @Column()
  description: string

  @Column()
  poster: string

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date
}