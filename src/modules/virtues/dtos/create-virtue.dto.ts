import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateVirtueDTO {
  @IsString()
  @MaxLength(256)
  @MinLength(3)
  text: string;
}
