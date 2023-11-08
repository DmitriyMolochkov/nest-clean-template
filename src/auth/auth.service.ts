import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';

import { JWT_CONFIG, USER_REFRESH_TOKEN_KEY_PREFIX } from 'common/constants';
import { IUser } from 'common/contracts';
import { JWTConfigDto } from 'infrastructure/config';
import { LdapService, UsersService } from 'users';

import { LoginDto } from './dto';
import { validatePassword } from './utils';

@Injectable()
export class AuthService {
  constructor(
    @Inject(JWT_CONFIG) private readonly jwtConfig: JWTConfigDto,
    private readonly usersService: UsersService,
    private readonly ldapService: LdapService,
    private readonly jwtService: JwtService,
    private readonly cache: Redis,
  ) {}

  public async login({ login, password }: LoginDto) {
    const user = await this.usersService.findByLogin(login);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    let isValid = false;
    if (user.useLDAP) {
      isValid = await this.ldapService.validate(login, password);
    } else {
      isValid = await validatePassword(password, user.password);
    }

    if (!isValid) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const { accessToken, refreshToken } = await this.getTokens(user);
    await this.updateRefreshToken(user, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  public async logout({ id, login }: IUser) {
    await this.cache.del(`${USER_REFRESH_TOKEN_KEY_PREFIX}_${id}_${login}`);
  }

  public async refreshTokens(user: IUser, refreshToken: string) {
    const userRefreshToken = await this.cache.get(`${USER_REFRESH_TOKEN_KEY_PREFIX}_${user.login}`);

    if (!userRefreshToken || userRefreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);

    return tokens;
  }

  private async updateRefreshToken({ id, login }: IUser, refreshToken: string) {
    await this.cache.set(`${USER_REFRESH_TOKEN_KEY_PREFIX}_${id}_${login}`, refreshToken);
  }

  private async getTokens({ id, login }: IUser) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id, login },
        {
          secret: this.jwtConfig.access_secret,
          expiresIn: this.jwtConfig.access_ttl,
        },
      ),
      this.jwtService.signAsync(
        { id, login },
        {
          secret: this.jwtConfig.refresh_secret,
          expiresIn: this.jwtConfig.refresh_ttl,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
