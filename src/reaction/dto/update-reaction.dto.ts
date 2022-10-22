import { PartialType } from '@nestjs/swagger';
import { AddReactionDto } from '@/reaction/dto/add-reaction.dto';

export class UpdateReactionDto extends PartialType(AddReactionDto) {}
