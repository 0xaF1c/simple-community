import { IsArray, IsBooleanString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class PostPublishParams {
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

export class PostLikeParams {
  @IsBooleanString()
  like: string

  @IsUUID()
  postId: string
}

export class PostCommentSendParams {
  @IsString()
  content: string

  @IsUUID()
  postId: string

  @IsUUID()
  @IsOptional()
  replyTo: string | null

  publisher: string
}