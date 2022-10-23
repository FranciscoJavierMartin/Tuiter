import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Feelings } from '@/reaction/interfaces/reaction.interface';
import { Post } from '@/post/models/post.schema';
import { GetPostsQuery } from '@/post/interfaces/post.interface';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  /**
   * Save post to DB
   * @param post Post to be saved
   */
  public async savePostToDb(post: Post): Promise<void> {
    const postCreated = new this.postModel(post);
    await postCreated.save();
  }

  /**
   * Get posts from DB
   * @param query Filter params to get posts
   * @param skip Skip X firsts posts
   * @param limit Maximun ammount of posts to retrieve
   * @param sort How to sort results
   * @returns Posts from DB
   */
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

  /**
   * Get post by Id from DB
   * @param postId post id to be retrieved
   * @returns Post from DB
   */
  public async getPostById(postId: string): Promise<Post> {
    return await this.postModel.findById(postId);
  }

  /**
   * Return ammount of posts from DB
   * @returns Ammount of posts from DB
   */
  public async postsCount(): Promise<number> {
    return await this.postModel.find({}).countDocuments();
  }

  /**
   * Retrieve post author id
   * @param postId post Id
   * @returns Post author id
   */
  public async getPostAuthorId(postId: string): Promise<string> {
    const post = await this.getPostById(postId);

    if (!post) {
      throw new BadRequestException(`Post ${postId} not found`);
    }

    return post.authorId.toString();
  }

  /**
   * Remove post from DB
   * @param postId Post id to be deleted
   */
  public async removePost(postId: string): Promise<void> {
    await this.postModel.deleteOne({ _id: postId });
  }

  /**
   * Update post in DB
   * @param postId Post id to be updated
   * @param post Post info to update
   */
  public async updatePost(postId: string, post: Post): Promise<void> {
    await this.postModel.updateOne({ _id: postId }, { $set: post });
  }

  /**
   * Update post reactions
   * @param postId Post is
   * @param newFeeling Feeling to increase count
   * @param previousFeeling (Optional) Previous feeling to decrease count
   * @returns Post document updated
   */
  public async updatePostReactions(
    postId: ObjectId,
    newFeeling: Feelings,
    previousFeeling?: Feelings,
  ): Promise<Post> {
    return await this.postModel.findByIdAndUpdate(
      postId,
      {
        $inc: previousFeeling
          ? {
              [`reactions.${previousFeeling}`]: -1,
              [`reactions.${newFeeling}`]: 1,
            }
          : {
              [`reactions.${newFeeling}`]: 1,
            },
      },
      { new: true },
    );
  }
}
