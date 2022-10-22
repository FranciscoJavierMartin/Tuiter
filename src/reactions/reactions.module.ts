import { Module } from '@nestjs/common';
import { ReactionsService } from '@/reactions/reactions.service';
import { ReactionsController } from '@/reactions/reactions.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ReactionsController],
  providers: [ReactionsService],
})
export class ReactionsModule {}
