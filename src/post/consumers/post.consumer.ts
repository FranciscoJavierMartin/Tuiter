import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumers/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/constants';
import { UserRepository } from '@/user/repositories/user.repository';
import { Post } from '@/post/models/post.model';
import {
  DeletePostParams,
  UpdatePostParams,
} from '@/post/interfaces/post.interface';
import { PostRepository } from '@/post/repositories/post.repository';

@Processor('post')
export class PostConsumer extends BaseConsumer {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {
    super('PostConsumer');
  }

  @Process({ name: 'addPostToDB', concurrency: CONSUMER_CONCURRENCY })
  public async addPostToDB(job: Job<Post>, done: DoneCallback): Promise<void> {
    try {
      await this.postRepository.savePostToDb(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({ name: 'deletePostFromDB', concurrency: CONSUMER_CONCURRENCY })
  public async deletePostFromDB(
    job: Job<DeletePostParams>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await Promise.all([
        await this.postRepository.removePost(job.data.postId),
        await this.userRepository.decrementUserPostsCount(job.data.authorId),
      ]);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({ name: 'updatePostInDB', concurrency: CONSUMER_CONCURRENCY })
  public async updatePostInDB(
    job: Job<UpdatePostParams>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      await this.postRepository.updatePost(job.data.postId, job.data.post);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
