import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { getQueues } from '@/helpers/utils';
import { EmailModule } from '@/email/email.module';
import { NotificationModule } from '@/notification/notification.module';
import { PostModule } from '@/post/post.module';
import { UserModule } from '@/user/user.module';
import { ReactionConsumer } from '@/reaction/consumers/reaction.consumer';
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
    BullModule.registerQueue(...getQueues('reaction')),
    PostModule,
    NotificationModule,
    UserModule,
    EmailModule,
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
