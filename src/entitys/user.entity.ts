import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('sc_user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 20,
    type: 'varchar',
    unique: true
  })
  name: string

  @Column({
    length: 20,
    type: 'varchar',
    unique: true
  })
  account: string

  @Column({
    length: 30,
    type: 'varchar',
    unique: true
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

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date
}

export class UserDTO {
  id: number

  name: string

  account: string

  email: string

  description: string

  avatarUrl: string

  backgroundUrl: string

  createTime: Date

  updateTime: Date
  constructor (user?: UserEntity | null | Record<string, any>) {
    if (user != null) {
      this.id = user.id
      this.name = user.name
      this.account = user.account
      this.email = user.email
      this.description = user.description
      this.avatarUrl = user.avatarUrl
      this.backgroundUrl = user.backgroundUrl
      this.createTime = user.createTime
      this.updateTime = user.updateTime  
    }
  }
}