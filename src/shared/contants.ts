import { JobOptions } from 'bull';

export const CONSUMER_CONCURRENCY = 5;
export const FILE_SIZE_LIMIT = 50;
export const FILE_SIZE_LIMIT_MB = 50 * 1024 * 1024;

export const DEFAULT_JOB_OPTIONS: JobOptions = {
  attempts: 3,
  backoff: {
    type: 'fixed',
    delay: 5000,
  },
  removeOnComplete: true,
};

export const REDIS_COMMENTS_COLLECTION = 'comments';
export const REDIS_POSTS_COLLECTION = 'posts';
export const REDIS_REACTIONS_COLLECTION = 'reactions';
export const REDIS_USERS_COLLECTION = 'users';
export const REDIS_FOLLOWING_COLLECTION = 'following';
export const REDIS_FOLLOWERS_COLLECTION = 'followers';
