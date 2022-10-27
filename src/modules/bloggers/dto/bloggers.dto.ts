import { IsString, IsUrl, Length } from 'class-validator';

export class CreateEditBloggersDto {
  id: string;
  @Length(1, 15)
  @IsString()
  name: string;
  @Length(1, 100)
  @IsUrl()
  @IsString()
  youtubeUrl: string;
}
