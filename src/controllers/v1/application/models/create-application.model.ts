import {
  IsISO8601,
  IsInt,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';
import {
  IsDateLessThan,
  MinDateCustom,
} from '../../../../utils/validators/class-validator.validators';
import { Type } from 'class-transformer';

export class CreateApplicationPilot {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class CreateApplicationRequest {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  vehicle: string;

  @ApiProperty()
  @IsISO8601({ strict: true, strictSeparator: true })
  @MinDateCustom(DateTime.now().plus({ hour: 2 }).toISO(), {
    message: 'startDate must be at least 2 hours from now',
  })
  startDate: string;

  @ApiProperty()
  @IsISO8601()
  @IsDateLessThan('startDate', {
    message: 'endDate must be at least 1 hours from startDate',
  })
  endDate: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateApplicationPilot)
  pilot: CreateApplicationPilot;
}
