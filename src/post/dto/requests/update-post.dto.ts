import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from '@/post/dto/requests/create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
