import { Global, Module } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PackageJsonDto } from './dtos';
import pkgJson from '../../../package.json';

@Global()
@Module({
  providers: [
    {
      provide: PackageJsonDto,
      async useFactory(): Promise<PackageJsonDto> {
        return plainToInstance(
          PackageJsonDto,
          pkgJson,
          { excludeExtraneousValues: true },
        );
      },
    },
  ],
  exports: [PackageJsonDto],
})
export class PackageJsonModule {}
