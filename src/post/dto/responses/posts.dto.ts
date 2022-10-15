import { PostDto } from '@/post/dto/responses/post.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PostsDto {
  @ApiProperty({
    description: 'Post count',
    type: Number,
  })
  postsCount: number;

  @ApiProperty({
    description: 'Posts',
    type: [PostDto],
  })
  posts: PostDto[];
}
