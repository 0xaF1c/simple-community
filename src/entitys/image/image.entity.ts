import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('sc_images')
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  url: string

  @Column()
  uploader: string
}
