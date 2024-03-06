import { createQueue } from '@nestjs/bullmq-wrapper';

import { NoteJobName } from '../enums';

export type JobData = { count: number };
export type JobReturnType = { count: number };

export const Step1JobQueue = createQueue<
  NoteJobName.step1,
  JobData,
  JobReturnType
>(NoteJobName.step1);
