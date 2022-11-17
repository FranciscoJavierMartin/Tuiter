import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseCache } from '@/shared/redis/base.cache';
import { ConfigService } from '@nestjs/config';
import { ID } from '@/shared/interfaces/types';
import { REDIS_CHAT_LIST_COLLECTION } from '@/shared/contants';
import { ObjectId } from 'bson';

@Injectable()
export class ChatCacheService extends BaseCache {
  constructor(configService: ConfigService) {
    super('ChatCache', configService);
  }

  public async addChatToCache(
    senderId: ID,
    receiverId: ID,
    chatId: ID,
  ): Promise<void> {
    try {
      const userChatList = await this.client.LRANGE(
        `${REDIS_CHAT_LIST_COLLECTION}:${senderId}`,
        0,
        -1,
      );

      if (
        !userChatList.some((userChat) =>
          userChat.includes(receiverId.toString()),
        )
      ) {
        await this.client.RPUSH(
          `${REDIS_CHAT_LIST_COLLECTION}:${senderId}`,
          JSON.stringify({ receiverId, chatId }),
        );
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async addMessageToCache(chatId: ObjectId): Promise<void> {
    console.log(chatId);
  }
}
