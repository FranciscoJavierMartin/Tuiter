import { Module } from '@nestjs/common';
import { ReactionService } from '@/reaction/reaction.service';
import { ReactionsController } from '@/reaction/reaction.controller';
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
  providers: [ReactionService],
})
export class ReactionModule {}
