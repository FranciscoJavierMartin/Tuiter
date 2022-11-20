import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatRepository } from '@/chat/repositories/chat.repository';

@Injectable()
export class IsChatMemberGuard implements CanActivate {
  constructor(private readonly chatRepository: ChatRepository) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const receiverId = request.body.receiverId;
    const senderId = request.body.senderId;
    const messageId = request.body.messageId;
    const userId = request.user.userId;

    return (
      (userId === receiverId || userId === senderId) &&
      (await this.chatRepository.isMessageFromChatMember(messageId, userId))
    );
  }
}
