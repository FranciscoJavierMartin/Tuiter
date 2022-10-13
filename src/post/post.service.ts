import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CreatePostDto } from '@/post/dto/requests/create-post.dto';
import { UpdatePostDto } from '@/post/dto/requests/update-post.dto';
import { Post } from '@/post/models/post.schema';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';

@Injectable()
export class PostService {
  create(
    createPostDto: CreatePostDto,
    user: CurrentUser,
    image?: Express.Multer.File,
  ) {
    const postId = new ObjectId();

    // const post: Post = {};
    return 'This action adds a new post';
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
}
