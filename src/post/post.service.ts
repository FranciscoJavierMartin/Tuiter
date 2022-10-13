import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '@/post/dto/requests/create-post.dto';
import { UpdatePostDto } from '@/post/dto/requests/update-post.dto';

@Injectable()
export class PostService {
  create(createPostDto: CreatePostDto, image?: Express.Multer.File) {
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
