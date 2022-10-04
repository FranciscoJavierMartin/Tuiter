import { Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache implements OnModuleInit {
  client: RedisClient;
  protected logger: Logger;

  constructor(cacheName: string, configService: ConfigService) {
    this.client = createClient({ url: configService.get('REDIS_HOST') });
    this.logger = new Logger(`Redis ${cacheName}`);
    this.cacheError();
  }

  async onModuleInit(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  private cacheError(): void {
    this.client.on('error', (error: unknown) => {
      this.logger.error(error);
    });
  }
}
