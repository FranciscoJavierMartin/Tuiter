import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { Post } from '@/post/models/post.schema';
import { PostService } from '@/post/services/post.service';

@Processor('post')
export class PostConsumer extends BaseConsumer {
  constructor(private readonly postService: PostService) {
    super('PostConsumer');
  }

  @Process({ name: 'addPostToDB', concurrency: 5 })
  public async addPostToDB(job: Job<Post>, done: DoneCallback): Promise<void> {
    try {
      this.postService.savePostToDb(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
