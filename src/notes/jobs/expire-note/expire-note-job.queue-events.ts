import { QueueEventsListener } from '@nestjs/bullmq';
import { BaseJobQueueEvents, buildQueueEventOptions } from '@nestjs/bullmq-wrapper';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { ExpireNoteJobQueue } from '../expire-note-job.queue';

@QueueEventsListener(ExpireNoteJobQueue.name, buildQueueEventOptions())
export class ExpireNoteJobQueueEvents extends BaseJobQueueEvents {
  protected readonly type = ExpireNoteJobQueue.name;

  public constructor(
    @InjectPinoLogger(ExpireNoteJobQueueEvents.name) protected readonly logger: PinoLogger,
  ) {
    super();
  }
}
