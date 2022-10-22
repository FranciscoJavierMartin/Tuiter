import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReactionService } from '@/reaction/reaction.service';
import { AddReactionDto } from '@/reaction/dto/requests/add-reaction.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';

@ApiTags('Reaction')
@Controller('post/reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  add(@Body() addReactionDto: AddReactionDto, @GetUser() user: CurrentUser) {
    return this.reactionsService.create(addReactionDto, user);
  }
}
