import {
  IsIn,
  IsInt,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ApplicationStatus } from 'src/domain/enums/application-status.enum';

export class UpdateApplicationPilot {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class UpdateApplicationStatus {
  @ApiProperty()
  @IsInt()
  @IsIn(Object.values(ApplicationStatus))
  id: number;
}

export class UpdateApplicationRequest {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  vehicle: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => UpdateApplicationPilot)
  pilot: UpdateApplicationPilot;
}
