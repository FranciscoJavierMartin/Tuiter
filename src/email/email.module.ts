import { getQueues } from '@/helpers/utils';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailService } from '@/email/services/email.service';
import { EmailSenderService } from '@/email/services/email-sender.service';
import { EmailConsumer } from '@/email/consumer/email.consumer';

@Module({
  imports: [BullModule.registerQueue(...getQueues('email'))],
  providers: [EmailService, EmailSenderService, EmailConsumer],
  exports: [EmailService],
})
export class EmailModule {}
