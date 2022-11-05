import { IsString, IsUrl, Length } from 'class-validator';

export class CreateEditBloggersDto {
  @Length(1, 15)
  @IsString()
  name: string;
  @Length(1, 100)
  @IsUrl()
  @IsString()
  youtubeUrl: string;
}
