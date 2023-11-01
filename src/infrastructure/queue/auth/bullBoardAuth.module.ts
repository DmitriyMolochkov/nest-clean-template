import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ConfigDto } from "src/infrastructure/config";

import { BullBoardAuthController } from "./bullBoardAuth.controller";
import { BullBoardAuthService } from "./bullBoardAuth.service";
import { LocalStrategy } from "./local.startegy";
import { SessionSerializer } from "./session.serializer";

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [BullBoardAuthController],
  providers: [
    BullBoardAuthService,
    LocalStrategy,
    SessionSerializer,
    {
      provide: "BULL_CONFIG",
      useFactory: (config: ConfigDto) => config.bullBoard,
      inject: [ConfigDto],
    },
  ],
})
export class BullBoardAuthModule {}
