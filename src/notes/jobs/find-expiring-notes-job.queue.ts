import { createQueue } from 'infrastructure/bullmq';

import { NoteJobName } from '../enums';

export type JobReturnType = {
  ids: number[];
  count: number;
};

export const FindExpiringNotesJobQueue = createQueue<
  undefined,
  JobReturnType
>(NoteJobName.findExpiringNotes);
