import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseJson } from '@/helpers/utils';
import { BaseCache } from '@/shared/redis/base.cache';
import { ID } from '@/shared/interfaces/types';
import { REDIS_CHAT_LIST_COLLECTION } from '@/shared/contants';

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

  public async addMessageToCache(chatId: ID): Promise<void> {
    console.log(chatId);
  }

  public async getUserChat(
    senderId: ID,
    receiverId: ID,
  ): Promise<{ receiverId: string; chatId: string } | undefined> {
    try {
      const userChatList = await this.client.LRANGE(
        `${REDIS_CHAT_LIST_COLLECTION}:${senderId}`,
        0,
        -1,
      );
      const receiverIdString = receiverId.toString();

      return parseJson(
        userChatList.find((userChat) => userChat.includes(receiverIdString)),
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
