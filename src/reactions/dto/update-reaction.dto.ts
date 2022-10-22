import { PartialType } from '@nestjs/swagger';
import { AddReactionDto } from '@/reactions/dto/add-reaction.dto';

export class UpdateReactionDto extends PartialType(AddReactionDto) {}
