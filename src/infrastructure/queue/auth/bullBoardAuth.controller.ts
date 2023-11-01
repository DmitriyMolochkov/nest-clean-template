import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Request, Response } from "express";

import { BullBoardAuthService } from "./bullBoardAuth.service";
import { LocalAuthGuard } from "./localAuth.guard";
import { ApiExcludeEndpoint } from "@nestjs/swagger";

@Controller("bull")
export class BullBoardAuthController {
  constructor(private readonly authService: BullBoardAuthService) {}

  @ApiExcludeEndpoint()
  @Get("/auth")
  @Render("auth")
  view(@Req() req: Request, @Res() res: Response): void {
    if (req.isAuthenticated()) return res.redirect("/bull/queues");
  }

  @ApiExcludeEndpoint()
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  login(@Res() res: Response): any {
    return res.redirect("/bull/queues");
  }
}
