import { BaseRepeatableJobWorker } from 'infrastructure/bullmq';

export type ReturnType = {
  ids: number[];
  count: number;
};

export type FindExpiringNotesJobQueue = BaseRepeatableJobWorker<ReturnType>['queue'];
