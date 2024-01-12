import { createQueue } from 'infrastructure/bullmq';

import { NoteJobName } from '../enums';

export type JobDataType = { id: number };
export type JobReturnType = { id: number };
export const ExpireNoteJobQueue = createQueue<JobDataType, JobReturnType>(NoteJobName.expireNote);
