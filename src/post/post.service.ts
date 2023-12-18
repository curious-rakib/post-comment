import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const createdPost = new this.postModel(createPostDto);
      return await createdPost.save();
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    try {
      const posts = await this.postModel.find().exec();
      if (!posts || (Array.isArray(posts) && posts.length === 0)) {
        throw new NotFoundException('Posts not found');
      }
      return posts;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.postModel.findById(id).exec();
      if (!post) {
        throw new NotFoundException("Post doesn't exist");
      }
      return post;
    } catch (error) {
      return error;
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const updatedPost = await this.postModel
        .findByIdAndUpdate({ _id: id }, { $set: updatePostDto }, { new: true })
        .exec();

      if (!updatedPost) {
        throw new NotFoundException("Post doesn't exist");
      }

      return updatedPost;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      await this.commentModel.deleteMany({ postId: id }).exec();
      return await this.postModel.findByIdAndDelete({ _id: id }).exec();
    } catch (error) {
      return error;
    }
  }
}
