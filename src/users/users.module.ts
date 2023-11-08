import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createClient } from 'ldapjs';

import { ConfigDto } from 'infrastructure/config';

import { User } from './entity';
import { LdapService } from './ldap.service';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    {
      provide: LdapService,
      useFactory: (config: ConfigDto) => {
        return new LdapService(
          createClient({
            url: config.ldap.url,
            reconnect: true,
          }),
          config.ldap,
        );
      },
      inject: [ConfigDto],
    },
  ],
  exports: [UsersService, LdapService],
})
export class UsersModule {}
