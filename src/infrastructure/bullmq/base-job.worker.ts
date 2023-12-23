import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { OnApplicationBootstrap } from '@nestjs/common';
import { Job, Queue, Worker } from 'bullmq';
import { WorkerListener } from 'bullmq/dist/esm/classes/worker';
import { PinoLogger } from 'nestjs-pino';

import { errorToObject } from 'common/utils';

import { hideContentIfNeeded } from './utils';

export abstract class BaseJobWorker<DataType = undefined, ReturnType = void>
  extends WorkerHost<Worker<DataType, ReturnType>>
  implements OnApplicationBootstrap {
  protected readonly abstract type: string;
  protected readonly abstract haveSensitiveData: boolean;

  public constructor(
    protected readonly logger: PinoLogger,
    protected readonly queue: Queue<DataType, ReturnType>,
  ) {
    super();
    this.onQueueEvents();
  }

  public async onApplicationBootstrap() {
    if (!this.worker.isRunning()) {
      this.worker
        .run()
        .catch((error) => {
          this.logger.fatal(
            {
              type: this.type,
              error: errorToObject(error),
            },
            'Fatal error in job queue',
          );
        });
    }
  }

  protected onQueueEvents() {
    this.queue.on('removed', (job) => {
      this.logger.info(
        {
          type: this.type,
          name: job.name,
          id: job.id,
          payload: hideContentIfNeeded(job.data, this.haveSensitiveData),
        },
        'Job removed from queue',
      );
    });

    this.queue.on('error', (error) => {
      this.logger.error(
        {
          type: this.type,
          error: {
            message: error.message,
            stack: error.stack,
          },
        },
        'Error in job queue',
      );
    });
  }

  @OnWorkerEvent('active')
  protected onActive(...[job]: Parameters<WorkerListener<DataType, ReturnType>['active']>) {
    this.logger.info(
      {
        type: this.type,
        name: job.name,
        id: job.id,
        payload: hideContentIfNeeded(job.data, this.haveSensitiveData),
      },
      'Job is active',
    );
  }

  @OnWorkerEvent('completed')
  protected async onCompleted(
    ...[job, result]: Parameters<WorkerListener<DataType, ReturnType>['completed']>
  ) {
    this.logger.info(
      {
        type: this.type,
        name: job.name,
        id: job.id,
        payload: hideContentIfNeeded(job.data, this.haveSensitiveData),
        result: hideContentIfNeeded(result, this.haveSensitiveData),
      },
      'Job completed',
    );

    try {
      await this.completeHandler(job, result);
    } catch (handlerError) {
      this.logger.error(
        {
          type: this.type,
          name: job.name,
          id: job.id,
          payload: hideContentIfNeeded(job.data, this.haveSensitiveData),
          result: hideContentIfNeeded(result, this.haveSensitiveData),
          error: errorToObject(handlerError),
        },
        'Cannot run complete handler for completed job',
      );
    }
  }

  @OnWorkerEvent('failed')
  protected async onFailed(
    ...[job, error]: Parameters<WorkerListener<DataType, ReturnType>['failed']>
  ) {
    this.logger.error(
      {
        type: this.type,
        name: job?.name,
        id: job?.id,
        payload: hideContentIfNeeded(job?.data, this.haveSensitiveData),
        error: errorToObject(error),
      },
      'Cannot execute job',
    );

    if (job) {
      try {
        await this.errorHandler(job, error);
      } catch (handlerError) {
        this.logger.error(
          {
            type: this.type,
            name: job.name,
            id: job.id,
            payload: hideContentIfNeeded(job.data, this.haveSensitiveData),
            error: errorToObject(handlerError),
          },
          'Cannot run error handler for job failure',
        );
      }
    }
  }

  @OnWorkerEvent('error')
  protected onError(...[failedReason]: Parameters<WorkerListener<DataType, ReturnType>['error']>) {
    this.logger.error(
      {
        type: this.type,
        error: errorToObject(failedReason),
      },
      'Error in job worker',
    );
  }

  public abstract process(job: Job<DataType, ReturnType>, token?: string): Promise<ReturnType>;

  protected async completeHandler(
    _job: Job<DataType, ReturnType>,
    _result: ReturnType,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ): Promise<void> {
  }

  protected async errorHandler(
    _job: Job<DataType, ReturnType>,
    _error: Error,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ): Promise<void> {
  }
}
