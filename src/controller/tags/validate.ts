import { IsOptional, IsString, Length } from "class-validator"

export class CreateTagParams {
  creator: string

  @IsString()
  @Length(1, 30)
  title: string

  @IsString()
  @IsOptional()
  description: string

  @IsOptional()
  @IsString()
  poster: string
}