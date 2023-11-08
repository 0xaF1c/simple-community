import { Column } from "typeorm";


export class TweetImages {
  @Column('uuid')
  image: string

  @Column('uuid')
  tweet: string
}