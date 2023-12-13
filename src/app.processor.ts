import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Processor('app')
export class AppProcessor extends WorkerHost {
  public constructor(
    @InjectPinoLogger(AppProcessor.name) private readonly logger: PinoLogger,
  ) {
    super();
  }

  public async process(job: Job): Promise<void> {
    this.logger.info('Start processor...');
    this.logger.info(job.data);
    this.logger.info('Completed');
  }
}
