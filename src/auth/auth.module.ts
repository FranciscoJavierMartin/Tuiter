import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { AuthUser, AuthSchema } from './models/auth.model';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { SharedModule } from 'src/shared/shared.module';
import { BullModule } from '@nestjs/bull';
import { AuthConsumer } from './consumers/auth.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuthUser.name, schema: AuthSchema }]),
    BullModule.registerQueue(
      {
        name: 'auth',
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 5000,
          },
          removeOnComplete: true,
        },
      },
      {
        name: 'user',
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 5000,
          },
          removeOnComplete: true,
        },
      },
    ),
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
  providers: [AuthService, JwtStrategy, AuthConsumer],
})
export class AuthModule {}
