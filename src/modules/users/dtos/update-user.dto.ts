import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  publicTag: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  @MinLength(3)
  displayName: string;
}
