import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('post')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId/comment')
  create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(postId, createCommentDto);
  }

  @Get(':postId/comments')
  findAll(@Param('postId') postId: string) {
    return this.commentService.findAll(postId);
  }

  @Get(':postId/comments/:id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':postId/comments/:id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':postId/comments/:id')
  remove(@Param('postId') postId: string, @Param('id') id: string) {
    return this.commentService.remove(postId, id);
  }
}
