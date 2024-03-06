import { createQueue } from '@nestjs/bullmq-wrapper';

import { NoteJobName } from '../enums';

export type JobDataType = { id: number };
export type JobReturnType = { id: number };
export const ExpireNoteJobQueue = createQueue<
  NoteJobName.expireNote,
  JobDataType,
  JobReturnType
>(NoteJobName.expireNote);
