import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectQueue } from '@nestjs/bull';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { Queue } from 'bull';
import { UploadApiResponse } from 'cloudinary';
import { isVideo } from '@/helpers/utils';
import { UploaderService } from '@/shared/services/uploader.service';
import { ID } from '@/shared/interfaces/types';
import { ImageJobData } from '@/image/interfaces/image.interface';
import { ImageService } from '@/image/image.service';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { CreatePostDto } from '@/post/dto/requests/create-post.dto';
import { Post } from '@/post/models/post.model';
import { PostCacheService } from '@/post/services/post.cache.service';
import { PostsDto } from '@/post/dto/responses/posts.dto';
import {
  DeletePostParams,
  UpdatePostParams,
} from '@/post/interfaces/post.interface';
import { UpdatePostDto } from '@/post/dto/requests/update-post.dto';
import { PostRepository } from '@/post/repositories/post.repository';

const PAGE_SIZE = 10;

@Injectable()
@WebSocketGateway({ cors: true })
export class PostService {
  @WebSocketServer() socket: Server;

  constructor(
    private readonly postCacheService: PostCacheService,
    private readonly uploaderService: UploaderService,
    private readonly postRespository: PostRepository,
    private readonly imageService: ImageService,
    @InjectQueue('post')
    private readonly postQueue: Queue<
      Post | DeletePostParams | UpdatePostParams
    >,
    @InjectQueue('image')
    private readonly imageQueue: Queue<ImageJobData>,
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
  ): Promise<void> {
    const postId = new ObjectId();

    const post: Post = {
      _id: postId,
      authorId: new mongoose.Types.ObjectId(user.userId),
      username: user.username,
      email: user.email,
      avatarColor: user.avatarColor,
      profilePicture: user.profilePicture,
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

        this.imageQueue.add('addImageToDb', {
          ownerId: user.userId,
          imgId: post.imgId,
          imgVersion: post.imgVersion,
          isVideo: isVideo(image.mimetype),
        });
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
  }

  /**
   * Get posts paginated
   * @param page Page number to retrieve
   * @returns Post collection
   */
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
      posts = await this.postRespository.getPosts({}, skip, limit, {
        createdAt: -1,
      });
      postsCount = await this.postRespository.postsCount();
    }

    return {
      posts,
      postsCount,
    };
  }

  /**
   * Remove post
   * @param postId Post id
   * @param authorId Post's author id
   */
  public async remove(postId: string, authorId: ID): Promise<void> {
    this.socket.emit('delete post', postId);

    const post = await this.postRespository.getPostById(postId);

    if (!post) {
      throw new BadRequestException(`Post with ${postId} not found`);
    }

    if (post.imgId) {
      try {
        await this.uploaderService.removeImage(post.imgId);
        this.imageService.removeImageByImgId(post.imgId);
      } catch (error) {
        throw new BadGatewayException('External server error');
      }
    }

    await this.postCacheService.deletePostFromCache(postId, authorId);

    this.postQueue.add('deletePostFromDB', { postId, authorId });
  }

  /**
   * Update post
   * @param postId Post id
   * @param updatePostDto Post data to be updated
   * @param authorId Author id
   * @param image (Optional) Image to add or update
   */
  public async update(
    postId: string,
    updatePostDto: UpdatePostDto,
    authorId: ID,
    image?: Express.Multer.File,
  ): Promise<void> {
    let result: UploadApiResponse;

    if (image) {
      const originalPost: Post = await this.postRespository.getPostById(postId);

      try {
        // Replace existing image
        if (originalPost.imgId && originalPost.imgVersion) {
          result = await this.uploaderService.uploadImage(
            image,
            originalPost.imgId,
            true,
            true,
          );

          this.imageQueue.add('updateImageInDb', {
            imgId: result.public_id,
            imgVersion: result.version.toString(),
            isVideo: isVideo(image.mimetype),
          });
        } else {
          // Add new image
          result = await this.uploaderService.uploadImage(image);

          this.imageQueue.add('addImageToDb', {
            ownerId: authorId,
            imgId: result.public_id,
            imgVersion: result.version.toString(),
            isVideo: isVideo(image.mimetype),
          });
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
}
