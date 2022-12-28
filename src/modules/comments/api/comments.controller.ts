import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../application (BLL)/comments.service';
import { JwtAuthGuard } from '../../auth/api/guards/jwt-auth.guard';
import { CreateCommentDTO } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put('/:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() { content }: CreateCommentDTO,
    @Request() req,
  ) {
    const comment = await this.commentsService.getCommentById(commentId);

    if (!comment) {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'Problem with a commentId field', field: 'commentId' },
        ],
      });
    }

    //ОШИБКА С ИКСЕПШИНОМ, ЕСЛИ КОММЕНТ НЕ ПОЛЬЗОВАТЕЛЯ
    if (req.user.id !== comment.userId) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'You cant edit the comment that is not your own',
            field: '',
          },
        ],
      });
    }

    const updatedPost = await this.commentsService.updateComment(
      commentId,
      content,
    );

    if (updatedPost) {
      return true;
    } else {
      return false;
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string, @Request() req) {
    const comment = await this.commentsService.getCommentById(commentId);

    if (!comment) {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'Problem with a commentId field', field: 'commentId' },
        ],
      });
    }

    //ОШИБКА С ИКСЕПШИНОМ, ЕСЛИ КОММЕНТ НЕ ПОЛЬЗОВАТЕЛЯ
    if (req.user.id !== comment.userId) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'You cant edit the comment that is not your own',
            field: '',
          },
        ],
      });
    }

    const deletedComment = await this.commentsService.deleteComment(commentId);

    if (deletedComment) {
      return true;
    } else {
      return false;
    }
  }

  @HttpCode(200)
  @Get('/:id')
  async getCommentById(@Param('id') id: string) {
    const comment = await this.commentsService.getCommentById(id);

    if (comment) {
      return comment;
    } else {
      throw new BadRequestException([
        { message: 'Comment with that Id not found', field: 'commentId' },
      ]);
    }
  }
}
