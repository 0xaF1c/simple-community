import { IsArray, IsBooleanString, IsOptional, IsString, IsUUID } from "class-validator"

export class TweetPublishParams {
  @IsString()
  content: string

  @IsString()
  title: string

  @IsOptional()
  @IsArray()
  images: string[]

  @IsOptional()
  @IsArray()
  tags: string[]

  publisher: string
}

export class TweetLikeParams {
  @IsBooleanString()
  like: string

  @IsUUID()
  tweetId: string
}