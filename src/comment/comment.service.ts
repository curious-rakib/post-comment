import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, Post } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Post') private readonly postModel: Model<Post>,
  ) {}

  async create(postId: string, createCommentDto: CreateCommentDto) {
    try {
      const createComment = new this.commentModel(createCommentDto);
      await createComment.save();

      await this.postModel
        .findByIdAndUpdate(
          { _id: postId },
          { $push: { comments: createComment._id } },
          { new: true },
        )
        .exec();

      return createComment;
    } catch (error) {
      return error;
    }
  }

  async findAll(postId: string) {
    try {
      const comments = await this.commentModel.find({ postId }).exec();
      if (!comments || (Array.isArray(comments) && comments.length === 0)) {
        throw new NotFoundException('Comments not found');
      }

      return comments;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const comment = await this.commentModel.findById(id).exec();
      if (!comment) {
        throw new NotFoundException("Comment doesn't exist");
      }

      return comment;
    } catch (error) {
      return error;
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const updatedComment = await this.commentModel
        .findByIdAndUpdate(
          { _id: id },
          { $set: updateCommentDto },
          { new: true },
        )
        .exec();

      if (!updatedComment) {
        throw new NotFoundException("Comment doesn't exist");
      }

      return updatedComment;
    } catch (error) {
      return error;
    }
  }

  async remove(postId: string, id: string) {
    try {
      const deletedComment = this.commentModel.findByIdAndDelete(id).exec();
      if (!deletedComment) {
        throw new NotFoundException("Comment doesn't exist");
      }

      await this.postModel
        .findByIdAndUpdate(
          { _id: postId },
          { $pull: { comments: id } },
          { new: true },
        )
        .exec();

      return deletedComment;
    } catch (error) {
      return error;
    }
  }
}
