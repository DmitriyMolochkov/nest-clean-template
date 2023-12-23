import { JobType } from 'bullmq';

export const notFinishedJobTypes: JobType[] = [
  'active',
  'delayed',
  'prioritized',
  'waiting',
  'waiting-children',
  'paused',
  'repeat',
  'wait',
];
