import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ValidateIdPipe } from '@/shared/pipes/validate-id.pipe';
import { ID } from '@/shared/interfaces/types';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';
import { IsNotAuthorGuard } from '@/post/guards/is-not-author.guard';
import { ReactionService } from '@/reaction/services/reaction.service';
import { AddReactionDto } from '@/reaction/dto/requests/add-reaction.dto';

@ApiTags('Reaction')
@Controller('post/reactions')
export class ReactionsController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Reaction added',
  })
  @ApiBadRequestResponse({
    description: 'Post not found',
  })
  @UseGuards(AuthGuard(), IsNotAuthorGuard)
  public add(
    @Body() addReactionDto: AddReactionDto,
    @GetUser() user: CurrentUser,
  ): void {
    return this.reactionService.create(addReactionDto, user);
  }

  @Delete(':postId')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Reaction removed',
  })
  @UseGuards(AuthGuard(), IsNotAuthorGuard)
  public remove(
    @Param('postId', ValidateIdPipe) postId: ID,
    @GetUser('username') username: string,
  ): void {
    return this.reactionService.remove(postId, username);
  }
}
