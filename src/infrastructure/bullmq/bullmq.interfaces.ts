import { RegisterQueueOptions } from '@nestjs/bullmq';
import {
  DefaultJobOptions,
  Job,
  JobsOptions,
  Queue,
  Worker,
} from 'bullmq';
import { WorkerListener } from 'bullmq/dist/esm/classes/worker';

export interface IBullJobRemoveOptions {
  removeOnComplete?: DefaultJobOptions['removeOnComplete'];
  removeOnFail?: DefaultJobOptions['removeOnFail'];
}

export interface IBullRepeatableJobOptions extends IBullJobRemoveOptions {
  readonly backoff?: DefaultJobOptions['backoff'];
  readonly attempts?: DefaultJobOptions['attempts'];
  readonly repeat: Exclude<JobsOptions['repeat'], undefined>;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export interface IQueueDefinition<Data = unknown, ReturnType = unknown>
  extends Omit<RegisterQueueOptions, 'name'> {
  name: string;
}

export interface IRepeatableQueueDefinition<ReturnType = unknown>
  extends IQueueDefinition<undefined, ReturnType> {}

export type JobData<Q extends IQueueDefinition> = Q extends IQueueDefinition<infer Data>
  ? Data
  : never;

export type JobReturnType<Q extends IQueueDefinition> = Q extends IQueueDefinition<
    unknown,
    infer ReturnType
  >
  ? ReturnType
  : never;

export type TypedQueue<Q extends IQueueDefinition> = Queue<JobData<Q>, JobReturnType<Q>>;

export type TypedWorker<Q extends IQueueDefinition> = Worker<JobData<Q>, JobReturnType<Q>>;

export type TypedWorkerListener<Q extends IQueueDefinition> =
  WorkerListener<JobData<Q>, JobReturnType<Q>>;

export type TypedJob<Q extends IQueueDefinition> = Job<JobData<Q>, JobReturnType<Q>>;
