import { IsNumber, IsString, Length } from 'class-validator';

export class CreatePostDTO {
  @Length(1, 30)
  @IsString()
  title: string;
  @Length(1, 100)
  @IsString()
  shortDescription: string;
  @Length(1, 1000)
  @IsString()
  content: string;
  @IsString()
  bloggerId: string;
}

export class UpdatePostDTO {
  @Length(1, 30)
  @IsString()
  title: string;
  @Length(1, 100)
  @IsString()
  shortDescription: string;
  @Length(1, 1000)
  @IsString()
  content: string;
  @IsString()
  bloggerId: string;
}