import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ type: String })
  comments: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

@Schema()
export class Comment extends Document {
  @Prop()
  postId: string;

  @Prop()
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
