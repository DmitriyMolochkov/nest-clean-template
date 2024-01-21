import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule, BullBoardQueueOptions } from '@bull-board/nestjs';
import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq';
import { DefaultJobOptions, KeepJobs, WorkerOptions } from 'bullmq';
import { QueueEventsOptions } from 'bullmq/dist/esm/interfaces/queue-options';
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

export function buildWorkerOptions(workerOptions: WorkerOptions = {}) {
  const options: WorkerOptions = {
    autorun: false,
    concurrency: workerOptions.concurrency ?? 1,
    maxStalledCount: workerOptions.maxStalledCount ?? 10,
    ...workerOptions,
  };

  return options;
}

export function buildQueueEventOptions(queueEventOptions: QueueEventsOptions = {}) {
  const options: QueueEventsOptions = {
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

export const createQueue = <Data, ReturnType = void>(
  name: string,
  options: Omit<RegisterQueueOptions, 'name'> = { defaultJobOptions: buildDefaultJobOptions() },
): IQueueDefinition<Data, ReturnType> => ({ ...options, name });

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
