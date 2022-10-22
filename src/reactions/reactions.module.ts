import { Module } from '@nestjs/common';
import { ReactionsService } from '@/reactions/reactions.service';
import { ReactionsController } from '@/reactions/reactions.controller';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
