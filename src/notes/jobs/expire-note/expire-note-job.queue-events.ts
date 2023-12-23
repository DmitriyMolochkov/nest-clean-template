import { QueueEventsListener } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { BaseJobQueueEvents, buildQueueEventOptions } from 'infrastructure/bullmq';

import { NoteJobName } from '../../enums';

@QueueEventsListener(NoteJobName.expireNote, buildQueueEventOptions())
export class ExpireNoteJobQueueEvents extends BaseJobQueueEvents {
  protected readonly type = NoteJobName.expireNote;

  public constructor(
    @InjectPinoLogger(ExpireNoteJobQueueEvents.name) protected readonly logger: PinoLogger,
  ) {
    super();
  }
}
