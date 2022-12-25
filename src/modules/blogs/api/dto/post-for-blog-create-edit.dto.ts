import { IsDate, IsString, IsUrl, Length } from 'class-validator';

export class CreateEditPostForBlogDto {
  @Length(1, 15)
  @IsString()
  title: string;
  @Length(1, 500)
  @IsString()
  shortDescription: string;
  @Length(1, 100)
  @IsString()
  content: string;
  // @IsDate()
  // createdAt: Date;
}
