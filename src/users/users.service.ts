import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entity';

@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async findByLogin(login: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { login } });

    return user;
  }
}
