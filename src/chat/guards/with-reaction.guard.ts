import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ChatRepository } from '@/chat/repositories/chat.repository';

@Injectable()
export class WithReactionGuard implements CanActivate {
  constructor(private readonly chatRepository: ChatRepository) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const messageId = request.body.messageId;

    if (!(await this.chatRepository.isMessageReacted(messageId))) {
      throw new BadRequestException(
        `Message with ${messageId} Id has not reaction yet.`,
      );
    }

    return true;
  }
}
