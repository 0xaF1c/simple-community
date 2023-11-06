import { IsString, Length, IsEmail, IsStrongPassword, IsOptional } from 'class-validator'

export class LoginParams {

  @IsOptional()
  @IsString()
  @Length(3, 30)
  account: string

  @IsOptional()
  @IsEmail()
  email: string

  @IsStrongPassword()
  password: string
}

export class RegisterParams {
  @IsEmail()
  @IsString()
  email: string

  @Length(3, 30)
  @IsOptional()
  @IsString()
  account: string

  @IsString()
  @IsStrongPassword()
  password: string

  @IsString()
  code: string

  @IsString()
  @IsOptional()
  description: string

  @IsString()
  @IsOptional()
  name: string

  backgroundUrl: string
  avatarUrl: string
}

export class GetLoginEmailCodeParams {
  @IsEmail()
  email: string
}

export class LoginWithEmailCodeParams {
  @IsEmail()
  email: string

  @IsString()
  code: string
}