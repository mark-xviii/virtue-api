import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  publicTag: string;

  @IsString()
  @MaxLength(64)
  @MinLength(3)
  displayName: string;

  @IsString()
  @MaxLength(64)
  @MinLength(3)
  password: string;
}

export class LoginUserDto {
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  publicTag: string;

  @IsString()
  @MaxLength(64)
  @MinLength(3)
  password: string;
}
