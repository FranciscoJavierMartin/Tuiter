import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumers/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';
import { ID } from '@/shared/interfaces/types';
import { ChatRepository } from '@/chat/repositories/chat.repository';
import {
  AddReactionToMessageJobData,
  MessageDocument,
} from '@/chat/interfaces/chat.interface';

@Processor('chat')
export class ChatConsumer extends BaseConsumer {
  constructor(private readonly chatRepository: ChatRepository) {
    super('ChatConsumer');
  }

  @Process({ name: 'addMessageToDB', concurrency: CONSUMER_CONCURRENCY })
  public async addMessageToDB(
    job: Job<MessageDocument>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      this.chatRepository.saveMessageToDB(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({ name: 'addReactionToMessage', concurrency: CONSUMER_CONCURRENCY })
  public async addReactionToMessage(
    job: Job<AddReactionToMessageJobData>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      this.chatRepository.addReactionToMessage(
        job.data.messageId,
        job.data.feeling,
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }

  @Process({
    name: 'removeReactionFromMessage',
    concurrency: CONSUMER_CONCURRENCY,
  })
  public async removeReactionFromMessage(
    job: Job<ID>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      this.chatRepository.removeReactionFromMessage(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
