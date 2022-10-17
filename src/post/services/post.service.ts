import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectQueue } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { FilterQuery, Model, Query, UpdateQuery } from 'mongoose';
import { Server } from 'socket.io';
import { Queue } from 'bull';
import { UploadApiResponse } from 'cloudinary';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { CreatePostDto } from '@/post/dto/requests/create-post.dto';
import { Post } from '@/post/models/post.schema';
import { PostCacheService } from '@/post/services/post.cache.service';
import { UploaderService } from '@/shared/services/uploader.service';
import { PostsDto } from '@/post/dto/responses/posts.dto';
import {
  DeletePostParams,
  GetPostsQuery,
  QueryComplete,
  QueryDeleted,
  UpdatePostParams,
} from '@/post/interfaces/post.interface';
import { UserDocument } from '@/user/interfaces/user.interface';
import { User } from '@/user/models/user.model';
import { UpdatePostDto } from '@/post/dto/requests/update-post.dto';

const PAGE_SIZE = 10;

@Injectable()
@WebSocketGateway({ cors: true })
export class PostService {
  @WebSocketServer() socket: Server;

  constructor(
    private readonly postCacheService: PostCacheService,
    private readonly uploaderService: UploaderService,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectQueue('post')
    private readonly postQueue: Queue<
      Post | DeletePostParams | UpdatePostParams
    >,
  ) {}

  /**
   * Create a post
   * @param createPostDto Post data
   * @param user post author
   * @param image Post image (Optional)
   * @returns Message confirming post creation
   */
  public async create(
    createPostDto: CreatePostDto,
    user: CurrentUser,
    image?: Express.Multer.File,
  ) {
    const postId = new ObjectId();

    const post: Post = {
      _id: postId,
      userId: user.userId,
      username: user.username,
      email: user.email,
      avatarColor: user.avatarColor,
      ...createPostDto,
      commentsCount: 0,
      imgId: '',
      imgVersion: '',
      createdAt: new Date(),
      reactions: {
        angry: 0,
        happy: 0,
        like: 0,
        love: 0,
        sad: 0,
        wow: 0,
      },
    };

    if (image) {
      try {
        const imageUploaded: UploadApiResponse =
          await this.uploaderService.uploadImage(image);
        post.imgVersion = imageUploaded.version.toString();
        post.imgId = imageUploaded.public_id;
      } catch (error) {
        throw new BadGatewayException('External server error');
      }
    }

    this.socket.emit('add-post', post);

    await this.postCacheService.storePostToCache(
      postId.toString(),
      user.userId,
      user.uId,
      post,
    );

    this.postQueue.add('addPostToDB', post);

    return {
      message: 'Post created successfully',
    };
  }

  /**
   * Save post to DB
   * @param post Post to be saved
   */
  public async savePostToDb(post: Post): Promise<void> {
    const postCreated = new this.postModel(post);
    await postCreated.save();
  }

  public async getAllPosts(page: number): Promise<PostsDto> {
    const skip: number = (page - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE * page;
    const newSkip: number = skip ? skip + 1 : skip;
    let postsCount: number = 0;
    let posts: Post[] = [];

    const cachedPosts: Post[] = await this.postCacheService.getPostsFromCache(
      newSkip,
      limit,
    );

    if (cachedPosts.length) {
      posts = cachedPosts;
      postsCount = await this.postCacheService.getPostsCountInCache();
    } else {
      posts = await this.getPosts({}, skip, limit, { createdAt: -1 });
      postsCount = await this.postsCount();
    }

    return {
      posts,
      postsCount,
    };
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

  public async postsCount(): Promise<number> {
    return await this.postModel.find({}).countDocuments();
  }

  public async remove(postId: string, authorId: string): Promise<void> {
    this.socket.emit('delete post', postId);

    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new BadRequestException(`Post with ${postId} not found`);
    }

    if (post.imgId) {
      try {
        await this.uploaderService.removeImage(post.imgId);
      } catch (error) {
        throw new BadGatewayException('External server error');
      }
    }

    await this.postCacheService.deletePostFromCache(postId, authorId);

    this.postQueue.add('deletePostFromDB', { postId, authorId });
  }

  //TODO: Check if exists, otherwise throw a 404 error
  public async getPostAuthorId(postId: string): Promise<string> {
    return (await this.postModel.findById(postId))?.userId?.toString();
  }

  public async removePost(postId: string, authorId: string): Promise<void> {
    const deletePost: Query<QueryComplete & QueryDeleted, Post> =
      this.postModel.deleteOne({ _id: postId });
    const decrementPostCount: UpdateQuery<UserDocument> =
      this.userModel.updateOne({ _id: authorId }, { $inc: { postsCount: -1 } });

    await Promise.all([deletePost, decrementPostCount]);
  }

  public async update(
    postId: string,
    updatePostDto: UpdatePostDto,
    image?: Express.Multer.File,
  ): Promise<void> {
    let result: UploadApiResponse;

    if (image) {
      const originalPost: Post = await this.postModel.findById(postId);

      try {
        if (originalPost.imgId && originalPost.imgVersion) {
          result = await this.uploaderService.uploadImage(
            image,
            originalPost.imgId,
            true,
            true,
          );
        } else {
          result = await this.uploaderService.uploadImage(image);
        }
      } catch (error) {
        throw new BadGatewayException('External server error');
      }
    }

    const updatedPost: Post = await this.postCacheService.updatePostInCache(
      postId,
      {
        ...updatePostDto,
        imgId: image ? result.public_id : '',
        imgVersion: image ? result.version.toString() : '',
      } as Post,
    );

    this.socket.emit('update post', updatedPost, 'posts');

    this.postQueue.add('updatePostInDB', { postId, post: updatedPost });
  }

  public async editPost(postId: string, post: Post): Promise<void> {
    await this.postModel.updateOne({ _id: postId }, { $set: post });
  }
}
