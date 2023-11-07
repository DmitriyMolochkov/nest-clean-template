import { Module } from '@nestjs/common';

import { ConfigDto } from 'infrastructure/config';

import { JobsService } from './jobs.service';

@Module({
  providers: [
    JobsService,
    {
      provide: 'JOBS_CONFIG',
      useFactory: (config: ConfigDto) => config.jobs,
      inject: [ConfigDto],
    },
  ],
})
export class JobsModule {}
