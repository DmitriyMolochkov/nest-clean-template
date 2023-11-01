import { InjectQueue } from "@nestjs/bullmq";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Queue } from "bullmq";

@ApiTags("App")
@Controller({
  path: "app",
  version: "1",
})
export class AppController {
  constructor(@InjectQueue("app") private readonly appQueue: Queue) {}

  @Get()
  public async hello(): Promise<string> {
    const greeting = "Hello world!";

    await this.appQueue.add("greetings", { greeting }, { delay: 5000 });

    return greeting;
  }
}
