import { IsString, Length, IsEmail, IsStrongPassword, IsOptional } from 'class-validator'

export class LoginParams {

  @IsOptional()
  @IsString()
  @Length(3, 30)
  account: string

  @IsOptional()
  @IsEmail()
  email: string

  @IsStrongPassword({minSymbols: 0, minUppercase: 1, minNumbers: 0, minLength: 8})
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
  @IsStrongPassword({minSymbols: 0, minUppercase: 1, minNumbers: 0, minLength: 8})
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

export class UpdateProfileParams {
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

export class UpdatePasswordParams {
  @IsStrongPassword({minSymbols: 0, minUppercase: 1, minNumbers: 0, minLength: 8})
  oldPassword: string

  @IsStrongPassword({minSymbols: 0, minUppercase: 1, minNumbers: 0, minLength: 8})
  newPassword: string
}