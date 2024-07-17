import { IsEmail, IsNumberString, IsOptional, IsString, Length } from "class-validator"

export class UpdateProfileParams {

  @IsNumberString()
  id: string

  @IsOptional()
  @IsString()
  @Length(3, 30)
  name: string

  @IsOptional()
  @IsString()
  @Length(3, 30)
  account: string

  @IsEmail()
  @IsOptional()
  email: string

  @IsString()
  @IsOptional()
  description: string

  @IsOptional()
  avatarUrl: string

  @IsOptional()
  backgroundUrl: string
}