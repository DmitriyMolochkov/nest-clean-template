import { createQueue } from '@nestjs/bullmq-wrapper';

import { NoteJobName } from '../enums';

export type JobReturnType = {
  ids: number[];
  count: number;
};

export const FindExpiringNotesJobQueue = createQueue<
  NoteJobName.findExpiringNotes,
  undefined,
  JobReturnType
>(NoteJobName.findExpiringNotes);
