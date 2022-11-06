import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumers/base.consumer';
import { CONSUMER_CONCURRENCY } from '@/shared/contants';
import { AuthDocument } from '@/auth/models/auth.model';
import { AuthRepository } from '@/auth/repositories/auth.repository';

@Processor('auth')
export class AuthConsumer extends BaseConsumer {
  constructor(private readonly authRepository: AuthRepository) {
    super('AuthConsumer');
  }

  @Process({ name: 'addAuthUserToDB', concurrency: CONSUMER_CONCURRENCY })
  public async addAuthUserToDB(
    job: Job<AuthDocument>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      this.authRepository.createAuthUser(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
