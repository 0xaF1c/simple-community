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

export class register {

}