import { Injectable } from '@nestjs/common';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { AddReactionDto } from '@/reaction/dto/add-reaction.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ReactionService {
  constructor(
    @InjectQueue('reaction') private readonly reactionQueue: Queue<any>,
  ) {}

  create(addReactionDto: AddReactionDto, user: CurrentUser) {
    return 'This action adds a new reaction';
  }
}
