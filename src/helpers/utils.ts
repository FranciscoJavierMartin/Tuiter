import { InternalServerErrorException } from '@nestjs/common';
import { BullModuleOptions } from '@nestjs/bull';
import { ObjectId } from 'mongodb';
import { DEFAULT_JOB_OPTIONS } from '@/shared/constants';
import { ID } from '@/shared/interfaces/types';
import { CurrentUser } from '@/auth/interfaces/current-user.interface';

const queues: BullModuleOptions[] = [
  {
    name: 'auth',
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  },
  {
    name: 'blockuser',
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  },
  {
    name: 'chat',
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  },
  {
    name: 'comment',
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  },
  {
    name: 'email',
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  },
  {
    name: 'follower',
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  },
  {
    name: 'image',
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  },
  {
    name: 'notification',
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  },
  {
    name: 'post',
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  },
  {
    name: 'reaction',
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  },
  {
    name: 'user',
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  },
];

/**
 * Generate a ramdon number with determined length
 * @param lenght Number lenght
 * @returns Ramdon number
 */
export function generateRandomIntegers(lenght: number): number {
  const characters = '0123456789';
  let result = ' ';

  for (let i = 0; i < lenght; i++) {
    result += characters.charAt(Math.floor(Math.random() * lenght));
  }

  return parseInt(result, 10);
}

/**
 * Transform passed string with first letter in upper case and the rest in lower case
 * @param str string to be transformed
 * @returns String transformed
 */
export function firstLetterUppercase(str: string): string {
  const valueString = str.toLowerCase();
  return valueString
    .split(' ')
    .map(
      (value) =>
        `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`,
    )
    .join(' ');
}

/**
 * Parse string to value
 * @param prop string to be parsed
 * @returns Parsed value
 */
export function parseJson<T = any>(prop: string): T {
  let res: T;

  try {
    res = JSON.parse(prop);
  } catch (error) {
    res = prop as T;
  }

  return res;
}

/**
 * Get queues for bull
 * @param names Queue names to get
 * @returns Queues filtered
 */
export function getQueues(...names: string[]): BullModuleOptions[] {
  return queues.filter((queue) => names.includes(queue.name));
}

/**
 * Shuffle list
 * @param list items to be shuffle
 * @returns Shuffled list
 */
export function shuffle<T>(list: T[]): T[] {
  return list.sort(() => 0.5 - Math.random());
}

/**
 * Escape text simbols
 * @param text text to be escaped
 * @returns Escaped text
 */
export function escapeRegexp(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Remove undefined values and the associated keys from object
 * @param obj Object to be filtered
 * @returns Filtered object
 */
export function removeUndefinedAttributes(obj: object): object {
  return Object.entries(obj)
    .filter((field) => field[1] !== undefined)
    .reduce((acc, [attribute, value]) => ({ ...acc, [attribute]: value }), {});
}

/**
 * Check if a file is a video throught its mimetype
 * @param mimetype File mimetype
 * @returns True if is a video, false otherwise
 */
export function isVideo(mimetype: string): boolean {
  return mimetype.includes('video');
}

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
  console.log(user);
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
