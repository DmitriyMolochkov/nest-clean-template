import { QueueEventsListener } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { BaseJobQueueEvents, buildQueueEventOptions } from 'infrastructure/bullmq';

import { Step1JobQueue } from '../step1-job.queue';

@QueueEventsListener(Step1JobQueue.name, buildQueueEventOptions())
export class Step1JobQueueEvents extends BaseJobQueueEvents {
  protected readonly type = Step1JobQueue.name;

  public constructor(
    @InjectPinoLogger(Step1JobQueueEvents.name) protected readonly logger: PinoLogger,
  ) {
    super();
  }
}
