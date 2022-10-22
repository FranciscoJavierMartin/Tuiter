import { PartialType } from '@nestjs/swagger';
import { CreateReactionDto } from '@/reactions/dto/create-reaction.dto';

export class UpdateReactionDto extends PartialType(CreateReactionDto) {}
