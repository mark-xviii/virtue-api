import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateVirtueDTO {
  @IsOptional()
  @IsString()
  @MaxLength(256)
  @MinLength(3)
  text: string;
}
