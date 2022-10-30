import { Module } from '@nestjs/common';
import { BlockUserService } from '@/block-user/block-user.service';
import { BlockUserController } from '@/block-user/block-user.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [BlockUserController],
  providers: [BlockUserService],
})
export class BlockUserModule {}
