import { BadGatewayException, Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { InjectQueue } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { Queue } from 'bull';
import { CreatePostDto } from '@/post/dto/requests/create-post.dto';
import { UpdatePostDto } from '@/post/dto/requests/update-post.dto';
import { Post } from '@/post/models/post.schema';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { PostCacheService } from '@/post/services/post.cache.service';
import { UploaderService } from '@/shared/services/uploader.service';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
@WebSocketGateway({ cors: true })
export class PostService {
  @WebSocketServer() socket: Server;

  constructor(
    private readonly postCacheService: PostCacheService,
    private readonly uploaderService: UploaderService,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectQueue('post') private readonly postQueue: Queue<Post>,
  ) {}

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

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  public async savePostToDb(post: Post): Promise<void> {
    const postCreated = new this.postModel(post);
    await postCreated.save();
  }
}
