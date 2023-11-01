import { Module } from "@nestjs/common";
import { LoggerModule as PinoLoggerModule } from "nestjs-pino";

import { ConfigDto } from "../config";
import { PackageJsonDto } from "../packageJson";

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigDto, PackageJsonDto],
      useFactory: (config: ConfigDto, packageJson: PackageJsonDto) => ({
        pinoHttp: {
          name: packageJson.name,
          level: config.logger.level,
          transport:
            config.configEnv === "develop"
              ? { target: "pino-pretty" }
              : undefined,
        },
      }),
    }),
  ],
})
export class LoggerModule {}
