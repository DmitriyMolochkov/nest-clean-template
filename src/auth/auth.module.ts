import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JWT_CONFIG } from 'common/constants';
import { ConfigDto } from 'infrastructure/config';
import { UsersModule } from 'users';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessGuard, RefreshGuard } from './guards';

@Module({
  imports: [UsersModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessGuard,
    RefreshGuard,
    {
      provide: JWT_CONFIG,
      inject: [ConfigDto],
      useFactory: (config: ConfigDto) => config.jwt,
    },
  ],
})
export class AuthModule {}
