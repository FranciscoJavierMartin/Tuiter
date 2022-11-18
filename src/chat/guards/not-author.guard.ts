import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatRepository } from '@/chat/repositories/chat.repository';

@Injectable()
export class NotAuthorGuard implements CanActivate {
  constructor(private readonly chatRepository: ChatRepository) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const messageId = request.body.messageId;
    const userId = request.user.userId;
    return !(await this.chatRepository.isMessageSender(messageId, userId));
  }
}
