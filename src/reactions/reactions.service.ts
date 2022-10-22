import { Injectable } from '@nestjs/common';
import { AddReactionDto } from '@/reactions/dto/add-reaction.dto';
import { UpdateReactionDto } from '@/reactions/dto/update-reaction.dto';

@Injectable()
export class ReactionsService {
  create(addReactionDto: AddReactionDto) {
    return 'This action adds a new reaction';
  }

  findAll() {
    return `This action returns all reactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`;
  }

  update(id: number, updateReactionDto: UpdateReactionDto) {
    return `This action updates a #${id} reaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`;
  }
}
