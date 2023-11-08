import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  url: string

  @Column()
  uploader: string
}
