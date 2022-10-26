import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from '@/comment/dto/create-comment.dto';
import { CommentCacheService } from '@/comment/services/comment.cache.service';

@Injectable()
export class CommentService {
  constructor(private readonly commentCacheService: CommentCacheService) {}

  public async create(createCommentDto: CreateCommentDto): Promise<void> {}
}
