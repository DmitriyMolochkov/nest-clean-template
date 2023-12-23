import { QueueEventsListener } from '@nestjs/bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { BaseJobQueueEvents, buildQueueEventOptions } from 'infrastructure/bullmq';

import { NoteJobName } from '../../enums';

@QueueEventsListener(NoteJobName.findExpiringNotes, buildQueueEventOptions())
export class FindExpiringNotesJobQueueEvents extends BaseJobQueueEvents {
  protected readonly type = NoteJobName.findExpiringNotes;

  public constructor(
    @InjectPinoLogger(FindExpiringNotesJobQueueEvents.name) protected readonly logger: PinoLogger,
  ) {
    super();
  }
}
