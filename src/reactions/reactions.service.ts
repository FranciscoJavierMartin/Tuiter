import { Injectable } from '@nestjs/common';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { AddReactionDto } from '@/reactions/dto/add-reaction.dto';

@Injectable()
export class ReactionsService {
  create(addReactionDto: AddReactionDto, user: CurrentUser) {
    return 'This action adds a new reaction';
  }
}
