import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { DEFAULT_JOB_OPTIONS } from '@/shared/contants';
import { PostModule } from '@/post/post.module';
import { ReactionConsumer } from '@/reaction/consumer/reaction.consumer';
import { Reaction, ReactionSchema } from '@/reaction/models/reaction.model';
import { ReactionsController } from '@/reaction/reaction.controller';
import { ReactionRepository } from '@/reaction/repositories/reaction.repository';
import { ReactionService } from '@/reaction/services/reaction.service';
import { ReactionCacheService } from '@/reaction/services/reaction.cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BullModule.registerQueue({
      name: 'reaction',
      defaultJobOptions: DEFAULT_JOB_OPTIONS,
    }),
    PostModule,
  ],
  controllers: [ReactionsController],
  providers: [
    ReactionService,
    ReactionRepository,
    ReactionConsumer,
    ReactionCacheService,
  ],
})
export class ReactionModule {}
