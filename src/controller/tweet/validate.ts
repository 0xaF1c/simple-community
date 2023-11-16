import { IsArray, IsBooleanString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class TweetPublishParams {
  @IsNotEmpty()
  @IsString()
  content: string

  @IsNotEmpty()
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

export class TweetCommentSendParams {
  @IsString()
  content: string

  @IsUUID()
  tweetId: string

  @IsUUID()
  @IsOptional()
  replyTo: string | null

  publisher: string
}