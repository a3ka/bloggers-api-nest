import { IsString, Length } from 'class-validator';

export class CreateCommentDTO {
  @Length(20, 300)
  @IsString()
  content: string;
}
