import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('auth')
export class AuthConsumer {
  @Process('addAuthUserToDB')
  async addAuthUserToDB(job: Job) {
    console.log('Calling from consumer', job.data);
  }
}
