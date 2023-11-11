import { IsBooleanString, IsUUID } from "class-validator";

export class CommentLikeParams {
  @IsBooleanString()
  like: string

  @IsUUID()
  commentId: string
}