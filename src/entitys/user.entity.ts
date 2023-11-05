import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class UserEntity {
  constructor() {}

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 20,
    type: 'varchar'
  })
  name: string

  @Column({
    length: 20,
    type: 'varchar'
  })
  account: string

  @Column({
    length: 30,
    type: 'varchar'
  })
  email: string

  @Column({
    length: 20,
    type: 'varchar'
  })
  password: string

  @Column('text')
  description: string

  @Column({
    length: 255,
    type: 'varchar'
  })
  avatarUrl: string

  @Column({
    length: 255,
    type: 'varchar'
  })
  backgroundUrl: string
}