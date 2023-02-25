import { InternalServerErrorException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ID } from '@/shared/interfaces/types';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';

/**
 * Get current user from request
 * @param user User from request
 * @param field (Optional) Field name to select
 * @returns User data from request
 */
export function getCurrentUserFromRequest(
  user?: CurrentUser,
  field?: string,
): string | ID | CurrentUser {
  let res: string | ID | CurrentUser;

  if (!user) {
    throw new InternalServerErrorException('User not found (request)');
  }

  if (field === 'userId') {
    res = new ObjectId(user[field]);
  } else if (field) {
    res = user[field];
  } else {
    res = user;
  }

  return res;
}
