import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseJson } from '@/helpers/utils';
import { BaseCache } from '@/shared/redis/base.cache';
import { ID } from '@/shared/interfaces/types';
import {
  REDIS_CHAT_LIST_COLLECTION,
  REDIS_MESSAGES_COLLECTION,
} from '@/shared/contants';
import { MessageDocument } from '@/chat/interfaces/chat.interface';
import { Feelings } from '@/reaction/interfaces/reaction.interface';

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

  public async addMessageToCache(
    chatId: ID,
    message: MessageDocument,
  ): Promise<void> {
    try {
      await this.client.RPUSH(
        `${REDIS_MESSAGES_COLLECTION}:${chatId}`,
        JSON.stringify(message),
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
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

  public async addReactionToCache(
    chatId: ID,
    messageId: ID,
    feeling: Feelings,
  ): Promise<void> {
    try {
      const { message, index } = await this.getMessageFromCache(
        chatId,
        messageId,
      );

      message.reaction = feeling;

      await this.client.LSET(
        `${REDIS_MESSAGES_COLLECTION}:${chatId}`,
        index,
        JSON.stringify(message),
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async getMessageFromCache(
    chatId: ID,
    messageId: ID,
  ): Promise<{ index: number; message: MessageDocument }> {
    try {
      let message: MessageDocument;
      const messageIdString: string = messageId.toString();

      const messages: string[] = await this.client.LRANGE(
        `${REDIS_MESSAGES_COLLECTION}:${chatId}`,
        0,
        -1,
      );
      const messageIndex: number = messages.findIndex((message: string) =>
        message.includes(messageIdString),
      );

      if (messageIndex !== -1) {
        message = parseJson<MessageDocument>(
          await this.client.LINDEX(
            `${REDIS_MESSAGES_COLLECTION}:${chatId}`,
            messageIndex,
          ),
        );
      } else {
        throw new NotFoundException(
          `Message with ID ${messageId} is not found`,
        );
      }

      return { message, index: messageIndex };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
