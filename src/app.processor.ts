import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Logger } from "nestjs-pino";

@Processor("app")
export class AppProcessor extends WorkerHost {
  constructor(private readonly logger: Logger) {
    super();
  }

  async process(job: Job): Promise<any> {
    this.logger.log("Start processor...");
    this.logger.log(job.data);
    this.logger.log("Completed");
  }
}
