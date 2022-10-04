import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { AuthUser, AuthSchema } from './schemas/auth.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { SharedModule } from 'src/shared/shared.module';
import { AuthQueueService } from './services/auth.queue.service';
import { BullModule } from '@nestjs/bull';
import { AuthConsumer } from './consumers/auth.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuthUser.name, schema: AuthSchema }]),
    BullModule.registerQueue({
      name: 'auth',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_TOKEN'),
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
    UserModule,
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthQueueService, AuthConsumer],
})
export class AuthModule {}
