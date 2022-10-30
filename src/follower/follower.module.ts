import { Module } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { FollowerController } from './follower.controller';

@Module({
  controllers: [FollowerController],
  providers: [FollowerService]
})
export class FollowerModule {}
