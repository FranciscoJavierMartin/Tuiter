import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    AuthModule,
    UserModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
