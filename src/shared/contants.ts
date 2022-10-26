import { JobOptions } from 'bull';

export const CONSUMER_CONCURRENCY = 5;
export const FILE_SIZE_LIMIT = 50;
export const FILE_SIZE_LIMIT_MB = 50 * 1000 * 1000;

export const DEFAULT_JOB_OPTIONS: JobOptions = {
  attempts: 3,
  backoff: {
    type: 'fixed',
    delay: 5000,
  },
  removeOnComplete: true,
};
