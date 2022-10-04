import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
  client: RedisClient;
  protected logger: Logger;

  constructor(cacheName: string, configService: ConfigService) {
    this.client = createClient({ url: configService.get('REDIS_HOST') });
    this.logger = new Logger(`Redis ${cacheName}`);
    this.cacheError();
  }

  private cacheError(): void {
    this.client.on('error', (error: unknown) => {
      this.logger.error(error);
    });
  }
}
