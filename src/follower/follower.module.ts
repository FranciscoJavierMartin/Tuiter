import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowerService } from '@/follower/follower.service';
import { FollowerController } from '@/follower/follower.controller';
import { Follower, FollowerSchema } from '@/follower/models/follower.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [FollowerController],
  providers: [FollowerService],
})
export class FollowerModule {}
