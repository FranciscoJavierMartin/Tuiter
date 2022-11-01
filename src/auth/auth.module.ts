import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { getQueues } from '@/helpers/utils';
import { UserModule } from '@/user/user.module';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { AuthUser, AuthSchema } from '@/auth/models/auth.model';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { AuthConsumer } from '@/auth/consumers/auth.consumer';
import { AuthRepository } from '@/auth/repositories/auth.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuthUser.name, schema: AuthSchema }]),
    BullModule.registerQueue(...getQueues('auth', 'user', 'email')),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_TOKEN'),
          signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, AuthConsumer, AuthRepository],
  exports: [AuthRepository],
})
export class AuthModule {}
