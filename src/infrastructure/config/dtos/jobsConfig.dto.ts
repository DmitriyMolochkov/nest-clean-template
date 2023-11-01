import { IsArray, IsDefined } from "class-validator";

export class JobsConfigDto {
  @IsDefined()
  @IsArray()
  public readonly deactivatedJobs!: string[];
}
