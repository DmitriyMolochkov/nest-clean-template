import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule, BullBoardQueueOptions } from '@bull-board/nestjs';
import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq';
import {
  NestQueueEventOptions,
} from '@nestjs/bullmq/dist/interfaces/queue-event-options.interface';
import { NestWorkerOptions } from '@nestjs/bullmq/dist/interfaces/worker-options.interface';
import { DefaultJobOptions, KeepJobs } from 'bullmq';
import { RepeatOptions } from 'bullmq/dist/esm/interfaces/repeat-options';

import { IBullJobRemoveOptions, IQueueDefinition } from './bullmq.interfaces';

export function hideContentIfNeeded<T>(content: T, haveSensitiveData: boolean) {
  return haveSensitiveData ? '[HIDDEN]' : content;
}

const defaultRemoveOnCompleteOpts: KeepJobs = {
  age: 2 * 24 * 60 * 60 * 1000, // 2 days
  count: 10_000,
};

const defaultRemoveOnFailOpts: KeepJobs = {
  age: 7 * 24 * 60 * 60 * 1000, // 7 days
  count: 1000,
};

export function buildJobRemovalOptions(opts: IBullJobRemoveOptions) {
  return {
    removeOnComplete: opts.removeOnComplete ?? defaultRemoveOnCompleteOpts,
    removeOnFail: opts.removeOnFail ?? defaultRemoveOnFailOpts,
  };
}

export function buildWorkerOptions(workerOptions: NestWorkerOptions = {}) {
  const options: NestWorkerOptions = {
    autorun: false,
    concurrency: workerOptions.concurrency ?? 1,
    maxStalledCount: workerOptions.maxStalledCount ?? 10,
    ...workerOptions,
  };

  return options;
}

export function buildQueueEventOptions(queueEventOptions: NestQueueEventOptions = {}) {
  const options: NestQueueEventOptions = {
    autorun: false,
    ...queueEventOptions,
  };

  return options;
}

export function buildDefaultJobOptions(
  options: DefaultJobOptions = {},
): DefaultJobOptions {
  return {
    backoff: options.backoff ?? {
      delay: 60 * 1000, // 1 minute
      type: 'exponential',
    },
    ...options,
    ...buildJobRemovalOptions(options),
  };
}

// you can use this option to disable the repeatable job the next time you start the application
export function getNeverRepeatOptions(): Required<Pick<RepeatOptions, 'limit'>> {
  return {
    limit: 0,
  };
}

export const createQueue = <JobType extends string, Data, ReturnType = void>(
  name: JobType,
  options: Omit<RegisterQueueOptions, 'name'> = { defaultJobOptions: buildDefaultJobOptions() },
): IQueueDefinition<JobType, Data, ReturnType> => ({ ...options, name });

export function registerBullQueue(...queues: ReturnType<typeof createQueue>[]) {
  return [
    BullModule.registerQueue(...queues),
    BullBoardModule.forFeature(
      ...queues.map(
        (q): BullBoardQueueOptions => ({
          name: q.name,
          adapter: BullMQAdapter,
        }),
      ),
    ),
  ];
}
