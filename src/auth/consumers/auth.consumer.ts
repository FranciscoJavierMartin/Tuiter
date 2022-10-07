import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { BaseConsumer } from '@/shared/consumer/base.consumer';
import { AuthDocument } from '@/auth/models/auth.model';
import { AuthService } from '@/auth/services/auth.service';

@Processor('auth')
export class AuthConsumer extends BaseConsumer {
  constructor(private authService: AuthService) {
    super('AuthConsumer');
  }

  @Process({ name: 'addAuthUserToDB', concurrency: 5 })
  public async addAuthUserToDB(
    job: Job<AuthDocument>,
    done: DoneCallback,
  ): Promise<void> {
    try {
      this.authService.createAuthUser(job.data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      this.logger.error(error);
      done(error as Error);
    }
  }
}
