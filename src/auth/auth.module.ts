import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { UserModule } from '@/user/user.module';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { AuthUser, AuthSchema } from '@/auth/models/auth.model';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { AuthConsumer } from '@/auth/consumers/auth.consumer';

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
      {
        name: 'email',
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
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthConsumer],
})
export class AuthModule {}
