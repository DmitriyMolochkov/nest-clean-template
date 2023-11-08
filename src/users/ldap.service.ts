import { Injectable } from '@nestjs/common';
import { Client } from 'ldapjs';

import { LdapConfigDto } from 'infrastructure/config';

@Injectable()
export class LdapService {
  constructor(private ldapClient: Client, private ldapConfig: LdapConfigDto) {
    ldapClient.on('error', () => {});
  }

  public async validate(login: string, password: string) {
    await this.ldapLogin();
    return this.checkUserAccess(login, password);
  }

  private async ldapLogin() {
    return new Promise<Client>((resolve, reject) => {
      this.ldapClient.bind(
        `${this.ldapConfig.dc}\\${this.ldapConfig.login}`,
        this.ldapConfig.password,
        (err) => {
          if (err) {
            reject(err);
          }
          resolve(this.ldapClient);
        },
      );
    });
  }

  private async checkUserAccess(login: string, password: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.ldapClient.bind(`${this.ldapConfig.dc}\\${login}`, password, (err) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
        this.ldapClient.unbind(() => null);
      });
    });
  }
}
