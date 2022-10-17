import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Query, UpdateQuery } from 'mongoose';
import { Post } from '@/post/models/post.schema';
import {
  GetPostsQuery,
  QueryComplete,
  QueryDeleted,
} from '@/post/interfaces/post.interface';
import { UserDocument } from '@/user/interfaces/user.interface';
import { User } from '@/user/models/user.model';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Save post to DB
   * @param post Post to be saved
   */
  public async savePostToDb(post: Post): Promise<void> {
    const postCreated = new this.postModel(post);
    await postCreated.save();
  }

  public async getPosts(
    query: GetPostsQuery,
    skip = 0,
    limit = 0,
    sort: Record<string, 1 | -1>,
  ): Promise<Post[]> {
    let postQuery: FilterQuery<any> = {};

    if (query.imgId && query.gifUrl) {
      postQuery = { $or: [{ imgId: { $ne: '' } }, { gifUrl: { $ne: '' } }] };
    } else {
      postQuery = query;
    }

    return await this.postModel.aggregate([
      { $match: postQuery },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
    ]);
  }

  public async getPostById(postId: string): Promise<Post> {
    return await this.postModel.findById(postId);
  }

  public async postsCount(): Promise<number> {
    return await this.postModel.find({}).countDocuments();
  }

  public async getPostAuthorId(postId: string): Promise<string> {
    const post = await this.getPostById(postId);

    if (!post) {
      throw new BadRequestException(`Post ${postId} not found`);
    }

    return post.userId.toString();
  }

  public async removePost(postId: string, authorId: string): Promise<void> {
    const deletePost: Query<QueryComplete & QueryDeleted, Post> =
      this.postModel.deleteOne({ _id: postId });
    const decrementPostCount: UpdateQuery<UserDocument> =
      this.userModel.updateOne({ _id: authorId }, { $inc: { postsCount: -1 } });

    await Promise.all([deletePost, decrementPostCount]);
  }

  public async updatePost(postId: string, post: Post): Promise<void> {
    await this.postModel.updateOne({ _id: postId }, { $set: post });
  }
}
