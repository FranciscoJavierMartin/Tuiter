import { getQueues } from '@/helpers/utils';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailService } from '@/email/services/email.service.service';
import { EmailSenderService } from '@/email/services/email-sender.service';

@Module({
  imports: [BullModule.registerQueue(...getQueues('email'))],
  providers: [EmailService, EmailSenderService],
  exports: [EmailService],
})
export class EmailModule {}
