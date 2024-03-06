import { InjectQueue, Processor } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { BaseJobWorker, TypedQueue, buildWorkerOptions } from 'infrastructure/bullmq';

import { Step1JobQueue } from '../step1-job.queue';

@Processor(Step1JobQueue.name, buildWorkerOptions())
export class Step1JobWorker extends BaseJobWorker<typeof Step1JobQueue> {
  protected readonly haveSensitiveData = false;

  protected readonly type = Step1JobQueue.name;

  public constructor(
    @InjectPinoLogger(Step1JobWorker.name) protected readonly logger: PinoLogger,
    @InjectQueue(Step1JobQueue.name)
    protected readonly step1JobQueue: TypedQueue<typeof Step1JobQueue>,
  ) {
    super(logger, step1JobQueue);
  }

  public async process(...[job]: Parameters<(BaseJobWorker<typeof Step1JobQueue>['process'])>) {
    const { count } = job.data;

    return {
      count: count + 1,
    };
  }

  public async completeHandler(
    ...[job, result]: Parameters<BaseJobWorker<typeof Step1JobQueue>['completeHandler']>
  ) {
    this.logger.info(
      {
        count: result.count,
        jobId: job.id,
      },
      'Step 1 successful',
    );
  }

  public async errorHandler(
    ...[job, error]: Parameters<BaseJobWorker<typeof Step1JobQueue>['errorHandler']>
  ) {
    this.logger.error(
      {
        count: job.data.count,
        jobId: job.id,
        error: {
          message: error.message,
          stack: error.stack,
        },
      },
      'Error while step 1',
    );
  }
}
