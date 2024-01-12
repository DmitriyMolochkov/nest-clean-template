import { InjectQueue, Processor } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { BaseJobWorker, TypedQueue, buildWorkerOptions } from 'infrastructure/bullmq';

import { Step2JobQueue } from '../step2-job.queue';

@Processor(Step2JobQueue.name, buildWorkerOptions())
export class Step2JobWorker extends BaseJobWorker<typeof Step2JobQueue> {
  protected readonly haveSensitiveData = false;

  protected readonly type = Step2JobQueue.name;

  public constructor(
    @InjectPinoLogger(Step2JobWorker.name) protected readonly logger: PinoLogger,
    @InjectQueue(Step2JobQueue.name)
    protected readonly expireNoteJobQueue: TypedQueue<typeof Step2JobQueue>,
  ) {
    super(logger, expireNoteJobQueue);
  }

  public async process(...[job]: Parameters<BaseJobWorker<typeof Step2JobQueue>['process']>) {
    const { count } = job.data;

    const childrenValues = await job.getChildrenValues();
    this.logger.info(childrenValues, 'childrenValues');

    return {
      count: count + 1,
    };
  }

  public async completeHandler(
    ...[job, result]: Parameters<BaseJobWorker<typeof Step2JobQueue>['completeHandler']>
  ) {
    this.logger.info(
      {
        count: result.count,
        jobId: job.id,
      },
      'Step 2 successful',
    );
  }

  public async errorHandler(
    ...[job, error]: Parameters<BaseJobWorker<typeof Step2JobQueue>['errorHandler']>
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
      'Error while step 2',
    );
  }
}
