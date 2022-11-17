import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumers/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';
import { ChatRepository } from '@/chat/repositories/chat.repository';
import { MessageDocument } from '@/chat/interfaces/chat.interface';

@Processor('chat')
export class PostConsumer extends BaseConsumer {
  constructor(private readonly chatRepository: ChatRepository) {
    super('ChatConsumer');
  }

  @Process({ name: 'addMessageToDB', concurrency: CONSUMER_CONCURRENCY })
  public async addPostToDB(
    job: Job<MessageDocument>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      // this.postRepository.savePostToDb(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
