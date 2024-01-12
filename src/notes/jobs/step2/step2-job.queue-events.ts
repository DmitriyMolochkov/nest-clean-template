import { QueueEventsListener } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { BaseJobQueueEvents, buildQueueEventOptions } from 'infrastructure/bullmq';

import { Step2JobQueue } from '../step2-job.queue';

@QueueEventsListener(Step2JobQueue.name, buildQueueEventOptions())
export class Step2JobQueueEvents extends BaseJobQueueEvents {
  protected readonly type = Step2JobQueue.name;

  public constructor(
    @InjectPinoLogger(Step2JobQueueEvents.name) protected readonly logger: PinoLogger,
  ) {
    super();
  }
}
