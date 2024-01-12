import { QueueEventsListener } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { BaseJobQueueEvents, buildQueueEventOptions } from 'infrastructure/bullmq';

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
