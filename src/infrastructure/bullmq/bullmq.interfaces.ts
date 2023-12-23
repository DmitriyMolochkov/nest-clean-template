import { JobsOptions } from 'bullmq';

export interface IBullJobRemoveOptions {
  removeOnComplete?: JobsOptions['removeOnComplete'];
  removeOnFail?: JobsOptions['removeOnFail'];
}

export interface IBullRepeatableJobOptions extends IBullJobRemoveOptions {
  readonly backoff?: JobsOptions['backoff'];
  readonly attempts?: JobsOptions['attempts'];
  readonly repeat: Exclude<JobsOptions['repeat'], undefined>;
}
