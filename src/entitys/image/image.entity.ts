import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('sc_images')
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  etag: string

  @Column()
  filename: string

  @Column()
  uploader: string

  @Column()
  key: string
}
