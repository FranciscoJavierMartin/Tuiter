import { Module } from '@nestjs/common';
import { ReactionsService } from '@/reactions/reactions.service';
import { ReactionsController } from '@/reactions/reactions.controller';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue({
      name: 'reaction',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
        removeOnComplete: true,
      },
    }),
  ],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
