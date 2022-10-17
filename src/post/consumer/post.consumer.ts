import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { Post } from '@/post/models/post.schema';
import {
  DeletePostParams,
  UpdatePostParams,
} from '@/post/interfaces/post.interface';
import { PostRepository } from '@/post/repositories/post.repository';

@Processor('post')
export class PostConsumer extends BaseConsumer {
  constructor(private readonly postRespository: PostRepository) {
    super('PostConsumer');
  }

  @Process({ name: 'addPostToDB', concurrency: 5 })
  public async addPostToDB(job: Job<Post>, done: DoneCallback): Promise<void> {
    try {
      this.postRespository.savePostToDb(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({ name: 'deletePostFromDB', concurrency: 5 })
  public async deletePostFromDB(
    job: Job<DeletePostParams>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      this.postRespository.removePost(job.data.postId, job.data.authorId);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({ name: 'updatePostInDB', concurrency: 5 })
  public async updatePostInDB(
    job: Job<UpdatePostParams>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      this.postRespository.updatePost(job.data.postId, job.data.post);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
