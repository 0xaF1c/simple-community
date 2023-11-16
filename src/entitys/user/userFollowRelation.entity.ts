import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sc_user_follow_relation')
export class UserFollowEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  userId: string

  @Column()
  followingId: string
}