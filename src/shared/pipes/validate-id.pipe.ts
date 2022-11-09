import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { ID } from '@/shared/interfaces/types';

@Injectable()
export class ValidateIdPipe implements PipeTransform {
  public transform(value: string): ID {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid Id');
    }
    return new ObjectId(value);
  }
}
