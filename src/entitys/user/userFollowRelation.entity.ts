import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sc_user_follow_relation')
export class UserFollowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @Column()
  followingId: string

  @CreateDateColumn()
  followAt: Date
}