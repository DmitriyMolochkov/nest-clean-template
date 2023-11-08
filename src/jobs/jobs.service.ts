import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Logger } from 'nestjs-pino';

import { JOBS_CONFIG } from 'common/constants';
import { JobsConfigDto } from 'infrastructure/config/dtos/jobsConfig.dto';

@Injectable()
export class JobsService implements OnApplicationBootstrap {
  constructor(
    @Inject(JOBS_CONFIG) private config: JobsConfigDto,
    private readonly logger: Logger,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onApplicationBootstrap() {
    this.shutdownJobs();
  }

  private shutdownJobs(): void {
    for (const jobName of this.config.deactivatedJobs) {
      if (this.schedulerRegistry.doesExist('cron', jobName)) {
        this.schedulerRegistry.getCronJob(jobName).stop();
        this.logger.warn(`job ${jobName} stopped!`);
      }
    }
  }
}
