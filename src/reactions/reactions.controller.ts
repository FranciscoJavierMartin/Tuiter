import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReactionsService } from '@/reactions/reactions.service';
import { AddReactionDto } from '@/reactions/dto/add-reaction.dto';

@ApiTags('Reaction')
@Controller('post/reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  add(@Body() addReactionDto: AddReactionDto) {
    return this.reactionsService.create(addReactionDto);
  }
}
