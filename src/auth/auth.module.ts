import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bull';
import { getQueues } from '@/helpers/utils';
import { EmailModule } from '@/email/email.module';
import { ImageModule } from '@/image/image.module';
import { UserModule } from '@/user/user.module';
import { AuthService } from '@/auth/services/auth.service';
import { SearchService } from '@/auth/services/search.service';
import { AuthController } from '@/auth/auth.controller';
import { AuthResolver } from '@/auth/auth.resolver';
import { AuthUser, AuthSchema } from '@/auth/models/auth.model';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { AuthConsumer } from '@/auth/consumers/auth.consumer';
import { AuthRepository } from '@/auth/repositories/auth.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AuthUser.name, schema: AuthSchema }]),
    BullModule.registerQueue(...getQueues('auth', 'user', 'image')),
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
    EmailModule,
    ImageModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    AuthConsumer,
    AuthRepository,
    SearchService,
    AuthResolver,
  ],
  exports: [SearchService],
})
export class AuthModule {}
