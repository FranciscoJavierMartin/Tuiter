import {
  BadRequestException,
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
} from '@/shared/constants';
import { MessageDocument } from '@/chat/interfaces/chat.interface';
import { Feelings } from '@/reaction/interfaces/reaction.interface';

type UserChatItem = { receiverId: string; chatId: string };

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
  ): Promise<UserChatItem | undefined> {
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

  public async removeReactionFromCache(
    chatId: ID,
    messageId: ID,
  ): Promise<void> {
    try {
      const { message, index } = await this.getMessageFromCache(
        chatId,
        messageId,
      );

      delete message.reaction;

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

  public async markMessagesAsRead(chatId: ID): Promise<void> {
    try {
      const messages: MessageDocument[] = (
        await this.client.LRANGE(
          `${REDIS_MESSAGES_COLLECTION}:${chatId}`,
          0,
          -1,
        )
      ).map<MessageDocument>((message) => parseJson<MessageDocument>(message));

      const nonReadMessagesIndex: number[] = messages
        .map<number>((message: MessageDocument, index: number) =>
          message.isRead ? -1 : index,
        )
        .filter((index) => index !== -1);

      nonReadMessagesIndex.forEach(async (index: number) => {
        const message = messages[index];
        message.isRead = true;

        await this.client.LSET(
          `${REDIS_MESSAGES_COLLECTION}:${chatId}`,
          index,
          JSON.stringify(message),
        );
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async markMessageAsDeleted(
    messageId: ID,
    senderId: ID,
    receiverId: ID,
    justForMe: boolean,
  ): Promise<void> {
    try {
      const chatId: string = await this.getChatIdFromCache(
        senderId,
        receiverId,
      );
      const { message, index } = await this.getMessageFromCache(
        chatId as unknown as ID,
        messageId,
      );

      if (justForMe) {
        message.deleteForMe = true;
      } else {
        message.deleteForMe = true;
        message.deleteForEveryone = true;
      }

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

  private async getChatIdFromCache(
    senderId: ID,
    receiverId: ID,
  ): Promise<string> {
    try {
      const receiverIdString: string = receiverId.toString();
      const userChatList: string[] = await this.client.LRANGE(
        `${REDIS_CHAT_LIST_COLLECTION}:${senderId}`,
        0,
        -1,
      );

      const userChat = userChatList.find((userChat) =>
        userChat.includes(receiverIdString),
      );

      if (!userChat) {
        throw new BadRequestException(`Users has not been chatted before`);
      }

      return parseJson<UserChatItem>(userChat).chatId;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
