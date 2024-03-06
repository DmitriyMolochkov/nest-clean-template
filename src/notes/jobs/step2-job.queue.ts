import { createQueue } from '../../infrastructure/bullmq';
import { NoteJobName } from '../enums';

export type JobData = { count: number };
export type JobReturnType = { count: number };

export const Step2JobQueue = createQueue<
  NoteJobName.step2,
  JobData,
  JobReturnType
>(NoteJobName.step2);
