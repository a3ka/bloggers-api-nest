import { IsString, IsUrl, Length } from 'class-validator';

export class CreateEditBlogDto {
  @Length(1, 15)
  @IsString()
  name: string;
  @Length(1, 500)
  @IsString()
  description: string;
  @Length(1, 100)
  @IsUrl()
  @IsString()
  websiteUrl: string;
}
